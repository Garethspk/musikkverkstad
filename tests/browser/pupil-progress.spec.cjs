const fs=require('node:fs');
const {test,expect}=require('./fixtures.cjs');
for(const locale of ['nn','nb','en']){
 test(`Theme 01 ${locale}: activities visible from every entry, keyboard and chosen levels`,async({page})=>{
  await page.goto('/'+locale+'.html');await page.locator('[data-nv="start"]').click();
  const choices=page.locator('[data-theme-action="section"]');await expect(choices).toHaveCount(3);for(const c of await choices.all())await expect(c).toBeVisible();
  await page.locator('[data-theme-action="section"][data-theme-value="create"]').focus();await page.keyboard.press('Enter');await expect(page.locator('[data-theme-action="save"]')).toBeVisible();
  await page.locator('[data-theme-action="level"][data-theme-value="4"]').click();await page.locator('.brand').click();await page.locator('[data-nv="continue"]').click();
  await expect(choices).toHaveCount(3);await expect(page.locator('[data-theme-action="level"][data-theme-value="4"]')).toHaveAttribute('aria-pressed','true');
  await page.selectOption('#themeSelect','1');await page.selectOption('#themeSelect','0');for(const c of await choices.all())await expect(c).toBeVisible();
  await page.evaluate(()=>{thState.screen='welcome';go('theme');});for(const c of await choices.all())await expect(c).toBeVisible();
  await page.locator('[data-theme-action="level"][data-theme-value="4"]').click();await page.locator('[data-theme-action="quick"]').click();await expect(page.locator('[data-theme-action="level"][data-theme-value="4"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-theme-action="explore"]').click();for(const c of await choices.all())await expect(c).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
 test(`Theme 02 ${locale}: real persistence, backup roundtrip and language change`,async({page})=>{
  page.on('dialog',d=>d.accept());await page.goto('/'+locale+'.html');await page.selectOption('#themeSelect','1');await page.locator('[data-gr-action="level"][data-gr-value="2"]').click();await page.locator('[data-gr-action="mode"][data-gr-value="repair"]').click();
  const different=await page.evaluate(()=>gr.answer.flatMap((x,i)=>x!==gr.target[i]?[i]:[]));for(const i of different)await page.locator(`[data-gr-action="cell"][data-gr-value="${i}"]`).click();
  await page.locator('[data-gr-action="check"]').click();await page.locator('[data-gr-action="check"]').click();expect(await page.evaluate(()=>data.groovePractice.done['repair-2'])).toBe(1);
  await page.locator('[data-gr-action="mode"][data-gr-value="create"]').click();await page.locator('[data-gr-action="cell"][data-gr-value="1"]').click();await page.locator('[data-gr-action="save"]').click();
  const saved=await page.evaluate(()=>JSON.stringify(data));await page.reload();expect(await page.evaluate(()=>JSON.stringify(data))).toBe(saved);await page.locator('[data-nv="continue"]').click();await expect(page.locator('[data-gr-action="level"][data-gr-value="2"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('.toolbar-menu summary').click();await page.locator(`[data-language="${locale==='en'?'nb':'en'}"]`).click();expect(await page.evaluate(()=>JSON.stringify(data))).toBe(saved);
  await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();await expect(page.locator('[data-gr-action="open"]')).toHaveCount(1);
  const waiting=page.waitForEvent('download');await page.locator('[data-export]').click();const download=await waiting;const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));expect(backup.groovePractice.done['repair-2']).toBe(1);
  const themeBefore=await page.evaluate(()=>JSON.stringify(thStore));const bad=structuredClone(backup);bad.groovePractice.version=99;
  await page.locator('#importFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await expect(page.locator('#importFeedback')).toContainText('Invalid Theme 02');expect(await page.evaluate(()=>JSON.stringify(data))).toBe(saved);expect(await page.evaluate(()=>JSON.stringify(thStore))).toBe(themeBefore);
  await page.locator('#importFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await expect(page.locator('#importFeedback')).not.toContainText('Invalid');expect(await page.evaluate(()=>JSON.stringify(data))).toBe(saved);
 });
}

test('school restrictions preserve restored Theme 02 history without enabling disabled content',async({page})=>{
 await page.goto('/en.html');const backup=await page.evaluate(()=>({...data,themeEnding:thStore,groovePractice:{version:1,level:1,done:{'repair-1':3},creations:[{level:1,pattern:[1,0,1,0]}]}}));
 page.on('dialog',d=>d.accept());await page.goto('http://127.0.0.1:8767/school-sites/theme/en.html');
 await page.evaluate(()=>go('progress'));await page.locator('#importFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 expect(await page.evaluate(()=>data.groovePractice.done['repair-1'])).toBe(3);await expect(page.locator('[data-gr-action="open"]')).toBeDisabled();await page.evaluate(()=>go('groove'));expect(await page.evaluate(()=>route)).toBe('theme');
 await page.goto('http://127.0.0.1:8767/school-sites/groove/en.html');await page.evaluate(()=>go('progress'));await page.locator('#importFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await expect(page.locator('[data-gr-action="open"]')).toBeDisabled();
 await page.locator('.brand').click();await page.locator('[data-nv="start"]').click();await expect(page.locator('[data-gr-action="level"]')).toHaveCount(2);await expect(page.locator('[data-gr-action="level"][data-gr-value="2"]')).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>data.groovePractice.level)).toBe(1);
});

for(const fault of ['quota','denied'])test(`Theme 02 ${fault} storage: in-memory work and real backup remain usable`,async({page})=>{
 await page.addInitScript(mode=>{
  if(mode==='quota')Storage.prototype.setItem=function(){throw new DOMException('Injected quota failure','QuotaExceededError');};
  else Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Injected storage denial','SecurityError');}});
 },fault);
 await page.goto('/en.html');await page.selectOption('#themeSelect','1');await page.locator('[data-gr-action="mode"][data-gr-value="create"]').click();await page.locator('[data-gr-action="save"]').click();
 expect(await page.evaluate(()=>data.groovePractice.creations.length)).toBe(1);await expect(page.locator('[role="status"]').filter({hasText:'Export before closing'}).first()).toBeVisible();
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();const waiting=page.waitForEvent('download');await page.locator('[data-export]').click();const file=await waiting;
 expect(JSON.parse(fs.readFileSync(await file.path(),'utf8')).groovePractice.creations.length).toBe(1);
});

test('corrupt stored progress is not overwritten by practice; explicit validated import recovers',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('musikkverkstad-v1','{damaged'));
 await page.goto('/en.html');await page.selectOption('#themeSelect','1');await page.locator('[data-gr-action="mode"][data-gr-value="create"]').click();await page.locator('[data-gr-action="save"]').click();
 expect(await page.evaluate(()=>localStorage.getItem('musikkverkstad-v1'))).toBe('{damaged');const recovery=await page.evaluate(()=>({...data,themeEnding:thStore}));
 page.on('dialog',d=>d.accept());await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();await page.locator('#importFile').setInputFiles({name:'recovery.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(recovery))});
 await expect.poll(()=>page.evaluate(()=>storageOK)).toBe(true);await expect(page.locator('#storageAlert')).toBeHidden();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('musikkverkstad-v1')).groovePractice.creations.length)).toBe(1);
});


test('Theme 02 native completed listening earns one persisted round',async({page})=>{
 await page.goto('/en.html');await page.selectOption('#themeSelect','1');
 for(const [action,value]of [['reference',''],['option','0'],['option','1']]){
  const control=page.locator(`[data-gr-action="${action}"][data-gr-value="${value}"]`);await control.click();
  await expect.poll(()=>page.evaluate(()=>gr.busy),{timeout:6000}).toBe(false);
 }
 expect(await page.evaluate(()=>buffers.length)).toBe(5);
 const correct=await page.evaluate(()=>gr.options.findIndex(p=>p.every((x,i)=>x===gr.target[i])));
 await page.locator(`[data-gr-action="choose"][data-gr-value="${correct}"]`).click();await page.locator(`[data-gr-action="choose"][data-gr-value="${correct}"]`).click();
 expect(await page.evaluate(()=>data.groovePractice.done['listen-1'])).toBe(1);await page.reload();expect(await page.evaluate(()=>data.groovePractice.done['listen-1'])).toBe(1);
});

test('backup predating Theme 02 preserves newer rounds and rhythms; explicit replacement is cancellable',async({page})=>{
 await page.goto('/en.html');const older=await page.evaluate(()=>({...data,themeEnding:thStore}));delete older.groovePractice;
 await page.selectOption('#themeSelect','1');await page.locator('[data-gr-action="mode"][data-gr-value="repair"]').click();
 const different=await page.evaluate(()=>gr.answer.flatMap((x,i)=>x!==gr.target[i]?[i]:[]));for(const i of different)await page.locator(`[data-gr-action="cell"][data-gr-value="${i}"]`).click();await page.locator('[data-gr-action="check"]').click();
 await page.locator('[data-gr-action="mode"][data-gr-value="create"]').click();await page.locator('[data-gr-action="save"]').click();const newer=await page.evaluate(()=>JSON.parse(JSON.stringify(data.groovePractice)));
 expect(newer.done['repair-1']).toBe(1);expect(newer.creations).toHaveLength(1);
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();
 const accept=dialog=>dialog.accept();page.on('dialog',accept);
 await page.locator('#importFile').setInputFiles({name:'older.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(older))});await expect(page.locator('#importFeedback')).toHaveClass('feedback good');expect(await page.evaluate(()=>data.groovePractice)).toEqual(newer);
 await page.reload();expect(await page.evaluate(()=>data.groovePractice)).toEqual(newer);
 // A backup explicitly containing Theme 02 follows the existing confirmed replacement rule.
 const replacement={...older,groovePractice:{version:1,level:1,done:{},creations:[]}};
 page.off('dialog',accept);const cancelled=page.waitForEvent('dialog').then(dialog=>dialog.dismiss());await page.evaluate(()=>go('progress'));
 await page.locator('#importFile').setInputFiles({name:'replace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await cancelled;await expect(page.locator('#importFile')).toHaveValue('');expect(await page.evaluate(()=>data.groovePractice)).toEqual(newer);
 page.on('dialog',accept);await page.locator('#importFile').setInputFiles({name:'replace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await expect(page.locator('#importFeedback')).toHaveClass('feedback good');expect(await page.evaluate(()=>data.groovePractice)).toEqual(replacement.groovePractice);
});

test('saved rhythm survives same-origin school update and language preference wins over new default',async({page})=>{
 const base='http://127.0.0.1:8767/school-sites/';await page.goto(base+'groove/en.html');await page.locator('[data-nv="start"]').click();await page.locator('[data-gr-action="level"][data-gr-value="2"]').click();await page.locator('[data-gr-action="mode"][data-gr-value="create"]').click();await page.locator('[data-gr-action="cell"][data-gr-value="1"]').click();await page.locator('[data-gr-action="save"]').click();
 const history=await page.evaluate(()=>JSON.parse(JSON.stringify(data.groovePractice)));expect(history.creations).toHaveLength(1);expect(history.creations[0].level).toBe(2);
 await page.goto(base+'updated/');await expect(page).toHaveURL(/updated\/en\.html$/);await expect(page.locator('#schoolIdentity')).toHaveText('Oppdatert skule');expect(await page.evaluate(()=>data.groovePractice)).toEqual(history);
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();await page.locator('[data-gr-action="open"]').click();await expect(page.locator('[data-gr-action="level"]')).toHaveCount(1);
 expect(await page.evaluate(()=>gr.answer)).toEqual(history.creations[0].pattern);await page.reload();expect(await page.evaluate(()=>data.groovePractice)).toEqual(history);
});
