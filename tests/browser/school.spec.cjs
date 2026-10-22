const fs=require('node:fs');
const {test,expect}=require('./fixtures.cjs');
const SC=require('../../src/school/config.js');
const olderSettings=require('../fixtures/school-v1-restricted.json');
const setup='http://127.0.0.1:8766/';
const pupil=theme=>'http://127.0.0.1:8767/school-sites/'+theme+'/';
async function openSetup(page){await page.goto(setup);await expect(page.locator('#schoolName')).toBeEnabled();}
async function importSettings(page,value){await page.locator('#settingsFile').setInputFiles({name:'school.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(value))});}
async function exported(page){const next=page.waitForEvent('download');await page.locator('#exportSettings').click();const download=await next;return JSON.parse(fs.readFileSync(await download.path(),'utf8'));}

test('principal workflow needs no pedagogical choices and includes all eligible prototype content',async({page})=>{
 await openSetup(page);
 await expect(page.locator('#advancedSettings')).not.toHaveAttribute('open','');
 await expect(page.locator('input[type="checkbox"]:visible')).toHaveCount(0);
 await expect(page.locator('#ageGroup')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Innhald og målgruppe'})).toBeVisible();
 await expect(page.locator('#contentSummary')).toContainText('Alle tilgjengelege');
 await page.locator('#schoolName').fill('Vanleg skule');
 const settings=await exported(page);
 expect(settings).toEqual({...SC.defaults(),schoolName:'Vanleg skule'});
 await page.locator('#advancedSettings summary').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#theme-theme')).toBeVisible();
 await expect(page.locator('#theme-theme')).toBeChecked();await expect(page.locator('#level-groove-4')).toBeChecked();
 await page.keyboard.press('Enter');await expect(page.locator('#theme-theme')).not.toBeVisible();
});

test('older v1 restrictions stay explicit through import, branding-only edits and draft reload',async({page})=>{
 await openSetup(page);await importSettings(page,olderSettings);
 await expect(page.locator('#message')).toContainText('importerte');
 await expect(page.locator('#contentSummary')).toContainText('avgrensingar');
 await expect(page.locator('#advancedSettings')).toHaveAttribute('open','');
 await expect(page.locator('#theme-theme')).not.toBeChecked();await expect(page.locator('#level-groove-1')).not.toBeChecked();
 expect(await exported(page)).toEqual(SC.validate(olderSettings));
 await page.locator('#advancedSettings summary').click();
 await page.locator('#schoolName').fill('Nytt skulenamn');await page.locator('#colourPreset').selectOption('blue');
 const changed=SC.validate({...olderSettings,schoolName:'Nytt skulenamn',colourPreset:'blue'});
 expect(await exported(page)).toEqual(changed);
 await page.locator('#saveDraft').click();await page.reload();await expect(page.locator('#schoolName')).toHaveValue('Nytt skulenamn');
 await expect(page.locator('#advancedSettings')).toHaveAttribute('open','');
 await expect(page.locator('#theme-theme')).not.toBeChecked();expect(await exported(page)).toEqual(changed);
 await page.locator('#resetSettings').click();await expect(page.locator('#theme-theme')).not.toBeVisible();
 expect(await exported(page)).toEqual(SC.defaults());
});

test('Nynorsk school form, real logo processing, draft and settings round-trip',async({page})=>{
 await openSetup(page);
 await expect(page.locator('html')).toHaveAttribute('lang','nn');
 await page.getByLabel('Skulenamn',{exact:true}).fill('Fjord skule');
 await page.getByLabel('Standardspråk').selectOption('en');
 await page.getByLabel('Skulefargar').selectOption('gold');
 await page.getByText('Avanserte innstillingar',{exact:true}).click();
 await page.locator('#theme-theme').uncheck();
 await page.locator('#level-groove-1').uncheck();await page.locator('#level-groove-3').uncheck();
 const png=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=400;canvas.height=200;const c=canvas.getContext('2d');c.fillStyle='#147';c.fillRect(0,0,400,200);return Array.from(Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1]),c=>c.charCodeAt(0)));});
 await page.locator('#logoFile').setInputFiles({name:'logo.png',mimeType:'image/png',buffer:Buffer.from(png)});
 await expect(page.locator('#message')).toContainText('kontrollert');
 await expect(page.locator('#logoImage')).toBeVisible();
 expect(await page.locator('#logoImage').evaluate(img=>img.naturalWidth)).toBe(256);
 const value=await exported(page);
 expect(value.schoolName).toBe('Fjord skule');expect(value.themes).toEqual(['groove']);expect(value.levels.groove).toEqual([2,4]);expect(value.logo).toMatch(/^data:image\/png;base64,/);
 expect(Object.keys(value)).not.toContain('pupilData');
 await page.locator('#saveDraft').click();await page.reload();await expect(page.locator('#schoolName')).toHaveValue('Fjord skule');
 await page.locator('#resetSettings').click();await expect(page.locator('#schoolName')).toHaveValue('');
 await importSettings(page,value);await expect(page.locator('#message')).toContainText('importerte');
 expect(await exported(page)).toEqual(value);
 await page.locator('#removeLogo').click();await expect(page.locator('#logoImage')).not.toBeVisible();
 expect((await exported(page)).logo).toBe(null);
 await expect(page.locator('#ageGroup')).toHaveCount(0);
 await expect(page.locator('#contentOptions input[id^="theme-"]')).toHaveCount(2);
});

test('invalid settings, unavailable content and unsafe or corrupt logos reject atomically',async({page})=>{
 await openSetup(page);await page.locator('#schoolName').fill('Trygg skule');
 for(const change of [s=>s.themes=['conversation'],s=>s.ageGroups=['6-10'],s=>s.schemaVersion=99,s=>s.levels.theme=[],s=>s.levels.create=[4],s=>s.pupilData={name:'No'},s=>s.logo='data:image/svg+xml;base64,PHN2Zy8+']){
  const value=SC.defaults();change(value);await importSettings(page,value);await expect(page.locator('#message')).toContainText('avvist');await expect(page.locator('#schoolName')).toHaveValue('Trygg skule');
 }
 for(const file of [{name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg onload="alert(1)"/>')}, {name:'bad.png',mimeType:'image/png',buffer:Buffer.from('not an image')}, {name:'large.png',mimeType:'image/png',buffer:Buffer.alloc(SC.MAX_FILE+1)}]){
  await page.locator('#logoFile').setInputFiles(file);await expect(page.locator('#message')).toContainText('avvist');await expect(page.locator('#logoImage')).not.toBeVisible();
 }
 await page.getByText('Avanserte innstillingar',{exact:true}).click();
 await page.locator('#theme-theme').uncheck();await page.locator('#theme-groove').uncheck();await page.locator('#exportSettings').click();await expect(page.locator('#message')).toContainText('temaval');
 await page.locator('#theme-theme').check();
 await page.locator('#level-theme-1').uncheck();await page.locator('#level-theme-2').uncheck();await page.locator('#level-theme-3').uncheck();await page.locator('#level-theme-4').uncheck();
 await page.locator('#exportSettings').click();await expect(page.locator('#message')).toContainText('nivå');
});

for(const theme of ['theme','groove'])for(const locale of ['nn','nb','en']){
 test(`${theme}/${locale}: actual school build, branding, enabled choices and pupil data preservation`,async({page})=>{
  await page.goto(pupil(theme)+locale+'.html');
  await expect(page.locator('#schoolIdentity')).toBeVisible();
  await expect(page.locator('#schoolIdentity')).toHaveText('Ås skule <img src=x onerror=alert(1)>');
  await expect(page.locator('.brand img')).toHaveCount(1);
  await expect.poll(()=>page.locator('.brand img').evaluate(img=>img.naturalWidth)).toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.brand-name img')).toHaveCount(0);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--green').trim())).toBe('#b8ddff');
  await expect(page.locator('#themeSelect option')).toHaveCount(1);await expect(page.locator('#themeSelect')).toHaveValue(theme==='theme'?'0':'1');
  await expect(page.locator('[data-nv="previous"]')).toBeDisabled();await expect(page.locator('[data-nv="next"]')).toBeDisabled();
  const baseline=await page.evaluate(()=>JSON.stringify(data));
  const stored=JSON.parse(baseline);stored.stats.rhythm={done:5,correct:3};stored.levels.rhythm=3;stored.extraPractice.puzzle={level:3,done:2,first:1,supported:0};
  await page.evaluate(value=>{localStorage.setItem('musikkverkstad-v1',JSON.stringify(value));localStorage.setItem('musikkverkstad-location-v1',JSON.stringify({route:'theme',level:3,mode:'create'}));},stored);
  await page.reload();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('musikkverkstad-v1')))).toEqual(stored);
  const entry=page.locator('[data-nv="continue"], [data-nv="start"]').first();await entry.click();
  if(theme==='theme'){
   await expect(page.locator('[data-theme-action="level"]')).toHaveCount(2);
   for(const level of [4,2]){const button=page.locator(`[data-theme-action="level"][data-theme-value="${level}"]`);await button.click();await expect(button).toHaveAttribute('aria-pressed','true');}
   await page.evaluate(()=>thAction('level','3'));expect(await page.evaluate(()=>thState.level)).toBe(2);
  }else{
   await expect(page.locator('[data-gr-action="level"]')).toHaveCount(2);
   for(const level of [4,2]){const button=page.locator(`[data-gr-action="level"][data-gr-value="${level}"]`);await button.click();await expect(button).toHaveAttribute('aria-pressed','true');}
   await page.evaluate(()=>go('theme'));await expect(page.locator('[data-gr-action="level"]')).toHaveCount(2);
  }
  await page.locator('.brand').click();await page.locator('[data-go="rhythm"]').click();
  await expect(page.locator('[data-level]')).toHaveCount(2);await expect(page.locator('[data-level="2"]')).toHaveAttribute('aria-pressed','true');
  for(const level of [4,2]){await page.locator(`[data-level="${level}"]`).click();await expect(page.locator(`[data-level="${level}"]`)).toHaveAttribute('aria-pressed','true');}
  const preserved=await page.evaluate(()=>JSON.parse(localStorage.getItem('musikkverkstad-v1')));
  expect(preserved.stats).toEqual(stored.stats);expect(preserved.extraPractice).toEqual(stored.extraPractice);
  for(const [id,prefix] of [['puzzle','pp'],['notation','nm']]){
   await page.locator('.brand').click();await page.locator(`[data-go="${id}"]`).click();
   const controls=page.locator(`[data-${prefix}-action="level"]`);await expect(controls).toHaveCount(2);
   await expect(page.locator(`[data-${prefix}-action="level"][data-${prefix}-value="2"]`)).toHaveAttribute('aria-pressed','true');
   const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('musikkverkstad-v1')));
   expect(before.extraPractice[id]).toEqual(stored.extraPractice[id]);
   for(const level of [4,2]){const control=page.locator(`[data-${prefix}-action="level"][data-${prefix}-value="${level}"]`);await control.click();await expect(control).toHaveAttribute('aria-pressed','true');}
   const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('musikkverkstad-v1')));
   for(const count of ['done','first','supported'])expect(after.extraPractice[id][count]).toBe(stored.extraPractice[id][count]);
  }
  const admin=await page.request.get(pupil(theme)+'setup/index.html');expect(admin.status()).toBe(404);
  expect(await page.locator('a[href*="setup"], [data-go="admin"], #settingsForm').count()).toBe(0);
  const exportData=await page.evaluate(()=>JSON.stringify({...data,themeEnding:thStore}));expect(exportData).not.toContain('schoolName');expect(exportData).not.toContain('school-draft');
 });
}

test('revoked prototype content is absent from cards and blocked on restored/direct routes',async({page})=>{
 await page.goto(pupil('revoked')+'en.html');
 await expect(page.locator('[data-go="rhythm"]')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(JSON.stringify(data)));saved.stats.rhythm={done:4,correct:2};
 await page.evaluate(value=>{localStorage.setItem('musikkverkstad-v1',JSON.stringify(value));localStorage.setItem('musikkverkstad-location-v1',JSON.stringify({route:'rhythm',level:2}));},saved);
 await page.reload();await expect(page.locator('[data-nv="start"]')).toBeVisible();
 expect(await page.evaluate(()=>data.stats.rhythm.done)).toBe(4);
 await page.evaluate(()=>go('rhythm'));expect(await page.evaluate(()=>route)).toBe('theme');
 await expect(page.locator('[data-level]')).toHaveCount(0);
 await page.locator('.brand').click();await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();
 await expect(page.locator('[data-go="rhythm"]')).toHaveCount(0);
 expect(await page.evaluate(()=>data.stats.rhythm.done)).toBe(4);
});

test('school default language yields to an existing valid pupil preference',async({page})=>{
 await page.goto(pupil('groove'));await expect(page).toHaveURL(/nb\.html$/);
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-language="en"]').click();
 await page.goto(pupil('groove'));await expect(page).toHaveURL(/en\.html$/);
});

test('denied administrator storage keeps downloadable settings usable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Denied by test');}});});
 await openSetup(page);await page.locator('#schoolName').fill('Utan lagring');await page.locator('#saveDraft').click();await expect(page.locator('#message')).toContainText('Kunne ikkje lagre');
 expect((await exported(page)).schoolName).toBe('Utan lagring');
});
