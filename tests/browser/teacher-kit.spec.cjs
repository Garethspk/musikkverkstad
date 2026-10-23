const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {test,expect,observeAudio}=require('./fixtures.cjs');
const url='http://127.0.0.1:8767/teacher-kit/teacher-review.html';
async function open(page,location=url){await page.goto(location);await page.locator('#openExercise').click();const f=page.frameLocator('#teacherPreview');await expect(f.locator('[data-gr-action="reference"]')).toBeVisible();return f;}
async function play(f,action,value){
 const key=action==='reference'?'reference':'option'+value;
 await f.locator('[data-gr-action="'+action+'"]'+(value===undefined?'':'[data-gr-value="'+value+'"]')).click();
 await expect.poll(()=>f.locator('body').evaluate((el,k)=>!!gr.heard[k],key)).toBe(true);
}
test('adult entry opens exact exercise, native audio matches rhythm, preserves controls and resets storage',async({page})=>{
 await observeAudio(page);const requests=[];page.on('request',r=>requests.push(r.url()));
 const f=await open(page);
 expect(await f.locator('body').evaluate(()=>({route,level:gr.level,mode:gr.mode,settings:schoolSettings.themes,levelChoices:scLevels('groove')}))).toEqual({route:'groove',level:1,mode:'listen',settings:['groove'],levelChoices:[1,2,3,4]});
 await expect(f.locator('[data-gr-action="mode"]')).toHaveCount(3);await expect(f.locator('#themeSelect option')).toHaveCount(1);
 const formBoundary=await f.locator('body').evaluate(()=>{const before=JSON.stringify(data.formPractice);go('form');foAction('mode','create');foAction('save');return {enabled:schoolSettings.formEnabled,allowed:scRouteAllowed('form'),route,unchanged:JSON.stringify(data.formPractice)===before};});
 expect(formBoundary).toEqual({enabled:false,allowed:false,route:'groove',unchanged:true});
 const weekBoundary=await f.locator('body').evaluate(()=>{const before=JSON.stringify(data.programmePractice);go('programme');wgAction('task','create');wgAction('save');return {enabled:schoolSettings.programmeEnabled,allowed:scRouteAllowed('programme'),route,unchanged:JSON.stringify(data.programmePractice)===before};});
 expect(weekBoundary).toEqual({enabled:false,allowed:false,route:'groove',unchanged:true});
 const cvBoundary=await f.locator('body').evaluate(()=>{const before=JSON.stringify(data.conversationPractice);go('conversation');cvAction('mode','create');cvAction('save');return {allowed:scRouteAllowed('conversation'),route,unchanged:JSON.stringify(data.conversationPractice)===before};});
 expect(cvBoundary).toEqual({allowed:false,route:'groove',unchanged:true});
 await expect(f.locator('[data-fo-action]')).toHaveCount(0);

 await expect(page.locator('#identity')).toContainText('pupilRelease=BLOCKED');
 expect(await page.locator('#teacherPreview').getAttribute('sandbox')).toBe('allow-scripts');
 expect(await f.locator('body').evaluate(()=>{try{return parent.document.title}catch{return 'denied'}})).toBe('denied');
 await page.evaluate(()=>localStorage.setItem('review-sentinel','outside'));expect(await f.locator('body').evaluate(()=>localStorage.getItem('review-sentinel'))).toBe(null);
 await expect(f.locator('.gr-stage')).toContainText('Ingen innleiing eller teljing');
 await f.locator('body').evaluate(()=>{window.__teacherSamples=[];const original=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){const result=original.apply(this,args);__teacherSamples.push(buffers.find(s=>s.buffer===this.buffer)?.m);return result;};});
 const patterns=await f.locator('body').evaluate(()=>({target:gr.target,options:gr.options}));
 expect(patterns.target).toHaveLength(4);expect(patterns.options.filter(x=>JSON.stringify(x)===JSON.stringify(patterns.target))).toHaveLength(1);
 await f.locator('[data-gr-action="choose"][data-gr-value="0"]').click();await expect(f.locator('.feedback')).toContainText(await f.locator('body').evaluate(()=>grText('hearFirst')));
 for(const [action,value,pattern] of [['reference',undefined,patterns.target],['option',0,patterns.options[0]],['option',1,patterns.options[1]]]){
  await f.locator('body').evaluate(()=>{__audioEvents.length=0});await play(f,action,value);
  const events=await f.locator('body').evaluate(()=>__audioEvents.filter(e=>e.kind==='start'));
  expect(events).toHaveLength(pattern.filter(Boolean).length);
  const sampled=await f.locator('body').evaluate(()=>__teacherSamples.splice(0));expect(sampled).toEqual(pattern.filter(Boolean).map(()=>60));
  const onsets=pattern.flatMap((v,i)=>v?[i*60/96]:[]);
  events.forEach((e,i)=>{expect(e.frames).toBeGreaterThan(1000);expect(e.rate).toBe(1);expect(e.scheduled-events[0].scheduled).toBeCloseTo(onsets[i],4)});
 }
 expect(await f.locator('body').evaluate(()=>buffers.length)).toBe(5);
 const good=patterns.options.findIndex(x=>JSON.stringify(x)===JSON.stringify(patterns.target));
 await f.locator('[data-gr-action="choose"][data-gr-value="'+(1-good)+'"]').click();await expect(f.locator('.feedback')).toContainText(await f.locator('body').evaluate(()=>grText('wrong')));
 await f.locator('[data-gr-action="choose"][data-gr-value="'+good+'"]').click();expect(await f.locator('body').evaluate(()=>gr.success)).toBe(true);
 await f.locator('[data-gr-action="level"][data-gr-value="2"]').click();expect(await f.locator('body').evaluate(()=>gr.level)).toBe(2);
 await f.locator('[data-gr-action="reference"]').click();await f.locator('[data-gr-action="stop"]').click();expect(await f.locator('body').evaluate(()=>gr.busy)).toBe(false);
 await f.locator('[data-go="home"]').first().click();await f.locator('[data-nv="start"]').click();expect(await f.locator('body').evaluate(()=>gr.level)).toBe(1);
 await page.locator('#closeExercise').click();await expect(page.locator('iframe')).toHaveCount(0);
 await page.locator('#openExercise').click();await expect(page.frameLocator('#teacherPreview').locator('[data-gr-action="reference"]')).toBeVisible();expect(await page.frameLocator('#teacherPreview').locator('body').evaluate(()=>data.groovePractice.done)).toEqual({});
 expect(await page.evaluate(()=>localStorage.getItem('review-sentinel'))).toBe('outside');
 expect(requests.filter(x=>/^https?:/.test(x)&&!x.startsWith('http://127.0.0.1:8767/'))).toEqual([]);
});
test('language recreation, spoof rejection and close while preparation is pending',async({page})=>{
 let f=await open(page);const before=await page.locator('#teacherPreview').getAttribute('srcdoc');
 await page.evaluate(()=>postMessage({type:'musikkverkstad-preview-language',session:'0'.repeat(32),locale:'en'},'*'));expect(await page.locator('#teacherPreview').getAttribute('srcdoc')).toBe(before);
 await f.locator('.toolbar-menu summary').click();await f.locator('[data-language="en"]').click();f=page.frameLocator('#teacherPreview');await expect(f.locator('html')).toHaveAttribute('lang','en');expect(await f.locator('body').evaluate(()=>({mode:gr.mode,level:gr.level}))).toEqual({mode:'listen',level:1});
 // Delay crypto operation without changing its result: close must invalidate the pending open.
 await page.evaluate(()=>{const original=crypto.subtle.digest.bind(crypto.subtle);window.resumeReview=null;crypto.subtle.digest=async(...args)=>{await new Promise(resolve=>window.resumeReview=resolve);crypto.subtle.digest=original;return original(...args);};});
 await f.locator('.toolbar-menu summary').click();await f.locator('[data-language="nn"]').click();await expect.poll(()=>page.evaluate(()=>typeof resumeReview)).toBe('function');await page.locator('#closeExercise').click();await page.evaluate(()=>resumeReview());
 await expect(page.locator('iframe')).toHaveCount(0);await expect(page.locator('#status')).toContainText('avslutta');
 await page.locator('#openExercise').click();await expect(page.frameLocator('#teacherPreview').locator('html')).toHaveAttribute('lang','nn');
});
test('corrupted embedded template fails closed without a preview',async({page})=>{
 await page.goto(url);await page.locator('#school-template').evaluate(e=>e.textContent+=' ');await page.locator('#openExercise').click();await expect(page.locator('#status')).toContainText('Kunne ikkje');await expect(page.locator('iframe')).toHaveCount(0);
});
test('standalone adult teacher entry needs no server or configuration',async({page})=>{
 const isolated=test.info().outputPath('teacher-review.html');fs.mkdirSync(path.dirname(isolated),{recursive:true});fs.copyFileSync('.quality/teacher-kit/teacher-review.html',isolated);
 try{const f=await open(page,pathToFileURL(isolated).href);await play(f,'reference');expect(await f.locator('body').evaluate(()=>({route,mode:gr.mode,level:gr.level}))).toEqual({route:'groove',mode:'listen',level:1});}
 finally{fs.rmSync(isolated,{force:true});} // Never upload a copied distributable as a test artifact.
});
