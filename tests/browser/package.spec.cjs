const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {test,expect,observeAudio}=require('./fixtures.cjs');
const older=require('../fixtures/school-v1-restricted.json');
const setup='http://127.0.0.1:8766/';
async function open(page){await page.goto(setup);await expect(page.locator('#schoolName')).toBeEnabled();}
async function preview(page){await page.locator('#previewSchool').click();await expect(page.locator('#pupilPreview')).toBeVisible();return page.frameLocator('#pupilPreview');}
async function download(page,info){
 const waiting=page.waitForEvent('download');
 if(info.project.use.hasTouch)await page.locator('#downloadPackage').tap();else await page.locator('#downloadPackage').click();
 const file=await waiting;
 const folder=path.resolve('.quality/school-sites','zip-'+info.project.name+'-'+info.testId.replace(/[^a-z0-9]/gi,''));
 fs.mkdirSync(folder,{recursive:true});const zip=folder+'.zip';await file.saveAs(zip);
 execFileSync(process.env.PYTHON||'python3',['-c','import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])',zip,folder]);
 return {folder,url:'http://127.0.0.1:8767/school-sites/'+path.basename(folder)+'/',manifest:JSON.parse(fs.readFileSync(path.join(folder,'school-package.json')))};
}
async function audio(frame){
 await frame.locator('.toolbar-menu summary').click();await frame.locator('[data-test-audio]').click();
 await expect.poll(()=>frame.locator('body').evaluate(()=>typeof buffers!=='undefined'&&buffers?.length)).toBe(5);
 expect(await frame.locator('body').evaluate(()=>({state:ctx.state,valid:buffers.every(s=>s.buffer.duration>1&&s.buffer.length>1000&&s.peak>0)}))).toEqual({state:'running',valid:true});
}

test('real candidate preview, viewport sizes, local audio and browser ZIP download',async({page},info)=>{
 await observeAudio(page);await open(page);await page.locator('#schoolName').fill('Fjord skule');await page.locator('#defaultLanguage').selectOption('en');await page.locator('#colourPreset').selectOption('blue');
 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=32;c.height=16;c.getContext('2d').fillRect(0,0,32,16);return Array.from(Uint8Array.from(atob(c.toDataURL().split(',')[1]),x=>x.charCodeAt(0)));});
 await page.locator('#logoFile').setInputFiles({name:'logo.png',mimeType:'image/png',buffer:Buffer.from(png)});await expect(page.locator('#message')).toContainText('kontrollert');
 let frame=await preview(page);await expect(frame.locator('#schoolIdentity')).toHaveText('Fjord skule');
 expect(await frame.locator('.brand img').evaluate(img=>img.naturalWidth)).toBe(32);
 expect(await frame.locator('body').evaluate(()=>innerWidth)).toBe(1100);
 await page.locator('#mobilePreview').click();expect(await frame.locator('body').evaluate(()=>[innerWidth,innerHeight])).toEqual([390,844]);
 expect(await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await audio(frame);
 await frame.locator('[data-language="nb"]').click();frame=page.frameLocator('#pupilPreview');await expect(frame.locator('html')).toHaveAttribute('lang','nb');
 const identity=await page.locator('#candidateIdentity').textContent();const result=await download(page,info);
 expect(identity).toContain(result.manifest.candidateHash);expect(result.manifest.pupilRelease).toBe('BLOCKED');
 expect(result.manifest.files.map(f=>f.path)).not.toContain('setup/index.html');
 for(const locale of ['nn','nb','en']){
  const html=fs.readFileSync(path.join(result.folder,locale+'.html'),'utf8');expect(html).not.toContain('previewBootstrap');expect(html).not.toContain('SchoolPackage');
  await page.goto(result.url+locale+'.html');await expect(page.locator('#schoolIdentity')).toHaveText('Fjord skule');await expect(page.locator('html')).toHaveAttribute('lang',locale);
  expect(await page.locator('.brand img').evaluate(img=>img.naturalWidth)).toBe(32);
 }
 await audio(page);expect(await page.evaluate(()=>__audioEvents.some(e=>e.kind==='start'&&e.frames>1000))).toBe(true);
 expect((await page.request.get(result.url+'setup/index.html')).status()).toBe(404);
});

test('older restrictions survive preview and export; edits invalidate the exact candidate',async({page},info)=>{
 await open(page);await page.locator('#settingsFile').setInputFiles({name:'older.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(older))});await expect(page.locator('#message')).toContainText('importerte');
 const frame=await preview(page);await expect(frame.locator('#themeSelect option')).toHaveCount(1);await expect(frame.locator('#themeSelect')).toHaveValue('1');
 await frame.locator('[data-nv="start"]').click();await expect(frame.locator('[data-gr-action="level"]')).toHaveCount(2);
 const identity=await page.locator('#candidateIdentity').textContent();await page.locator('#schoolName').fill('Oppdatert skule');await expect(page.locator('#pupilPreview')).toHaveCount(0);
 const result=await download(page,info);expect(identity).not.toContain(result.manifest.candidateHash);
 expect(JSON.parse(fs.readFileSync(path.join(result.folder,'school-settings.json')))).toEqual({...older,schoolName:'Oppdatert skule'});
 await page.goto(result.url+'en.html');await page.evaluate(()=>{data.stats.rhythm={done:4,correct:2};localStorage.setItem('musikkverkstad-v1',JSON.stringify(data));localStorage.setItem('musikkverkstad-language','en');});
 await page.reload();expect(await page.evaluate(()=>data.stats.rhythm.done)).toBe(4);
 await page.locator('[data-nv="start"], [data-nv="continue"]').first().click();await expect(page.locator('[data-gr-action="level"]')).toHaveCount(2);
 await expect(page.locator('[data-gr-action="level"][data-gr-value="1"]')).toHaveCount(0);
});

test('invalid selections and corrupted base template cannot export a package',async({page})=>{
 await open(page);let downloads=0;page.on('download',()=>downloads++);
 await page.locator('#advancedSettings summary').click();await page.locator('#theme-theme').uncheck();await page.locator('#theme-groove').uncheck();await page.locator('#downloadPackage').click();await expect(page.locator('#message')).toContainText('temaval');expect(downloads).toBe(0);
 await page.locator('#theme-theme').check();await page.locator('#school-template').evaluate(el=>el.textContent+=' ');await page.locator('#downloadPackage').click();await expect(page.locator('#message')).toContainText('Kunne ikkje');expect(downloads).toBe(0);await expect(page.locator('#pupilPreview')).toHaveCount(0);
});

test('opaque sandbox denies parent storage, spoofed messages and outbound connections',async({browser})=>{
 // Deliberate policy violations have their own page: expected CSP errors are observed explicitly.
 const context=await browser.newContext();const page=await context.newPage();const errors=[],consoleErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 try{
  await open(page);await page.evaluate(()=>localStorage.setItem('pupil-sentinel','real pupil data'));await preview(page);const frame=page.frames().find(f=>f.parentFrame());
  expect(await page.locator('#pupilPreview').getAttribute('sandbox')).toBe('allow-scripts');
  expect(await frame.evaluate(()=>{try{return parent.document.title;}catch{return 'denied';}})).toBe('denied');
  expect(await frame.evaluate(()=>localStorage.getItem('pupil-sentinel'))).toBe(null);await frame.evaluate(()=>localStorage.setItem('pupil-sentinel','preview only'));expect(await page.evaluate(()=>localStorage.getItem('pupil-sentinel'))).toBe('real pupil data');
  const before=await page.locator('#pupilPreview').getAttribute('srcdoc');await page.evaluate(()=>postMessage({type:'musikkverkstad-preview-language',session:'0'.repeat(32),locale:'en'},'*'));expect(await page.locator('#pupilPreview').getAttribute('srcdoc')).toBe(before);
  expect(await frame.evaluate(async()=>{try{await fetch('https://example.com/');return 'allowed';}catch{return 'denied';}})).toBe('denied');
  expect(await frame.evaluate(()=>new Promise(resolve=>{const x=new XMLHttpRequest();x.onerror=()=>resolve('denied');x.onload=()=>resolve('allowed');x.open('GET','https://example.com/');x.send();}))).toBe('denied');
  expect(consoleErrors.some(x=>x.includes('Content Security Policy'))).toBe(true);expect(errors).toEqual([]);
  await page.locator('#closePreview').click();await expect(page.locator('#pupilPreview')).toHaveCount(0);
 }finally{await context.close();}
});


test('removing logo discards the old preview and candidate',async({page},info)=>{
 await open(page);
 await expect(page.locator('#schoolName')).toBeEnabled();await page.locator('#schoolName').fill('Lokal skule');
 const logo='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
 await page.locator('#logoFile').setInputFiles({name:'logo.png',mimeType:'image/png',buffer:Buffer.from(logo,'base64')});await expect(page.locator('#message')).toContainText('kontrollert');
 let frame=await preview(page);await expect(frame.locator('.brand img')).toHaveCount(1);
 const old=await page.locator('#candidateIdentity').textContent();await page.locator('#removeLogo').click();await expect(page.locator('#pupilPreview')).toHaveCount(0);await expect(page.locator('#candidateIdentity')).toHaveText('');
 frame=await preview(page);await expect(frame.locator('.brand img')).toHaveCount(0);const result=await download(page,info);expect(old).not.toContain(result.manifest.candidateHash);
 expect(JSON.parse(fs.readFileSync(path.join(result.folder,'school-settings.json'))).logo).toBe(null);
 expect(await page.locator('#candidateIdentity').textContent()).toContain(result.manifest.candidateHash);
});


test('standalone downloaded setup needs no server or development tools',async({page},info)=>{
 await page.goto(require('node:url').pathToFileURL(path.resolve('setup/index.html')).href);
 await expect(page.locator('#schoolName')).toBeEnabled();await page.locator('#schoolName').fill('Frittståande skule');
 const frame=await preview(page);await expect(frame.locator('#schoolIdentity')).toHaveText('Frittståande skule');
 const result=await download(page,info);expect(result.manifest.pupilRelease).toBe('BLOCKED');
});
