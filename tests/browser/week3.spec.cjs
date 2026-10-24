const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {test, expect, observeAudio} = require('./fixtures.cjs');
const SC = require('../../src/school/config.js');

// Native Chromium DOM/control/audio-scheduling evidence only. No physical-device,
// audible-speaker, teacher, pupil or real assistive-technology approval is inferred.
const b = (page, action, value) => page.locator(`[data-w3="${action}"]${value === undefined ? '' : `[data-w3-value="${value}"]`}`);
const cvb = (page, action, value) => page.locator(`[data-cv-action="${action}"]${value === undefined ? '' : `[data-cv-value="${value}"]`}`);
const fob = (page, action, value) => page.locator(`[data-fo-action="${action}"]${value === undefined ? '' : `[data-fo-value="${value}"]`}`);
const editions = 'http://127.0.0.1:8767/school-sites/';
const copy = value => structuredClone(value);
async function activate(locator, info) { if (info.project.use.hasTouch) await locator.tap(); else await locator.click(); }
async function enter(page, task = 'debug', locale = 'en', base = '/') {
  await page.goto(base + locale + '.html'); await b(page, 'enter', task).click();
  await expect(b(page, 'task')).toHaveCount(3);
}
async function noAudio(page) {
  let constructions = 0; const samples = [];
  await page.exposeFunction('__week3AudioConstructed', () => { constructions++; });
  page.on('request', r => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(r.url())) samples.push(r.url()); });
  await page.addInitScript(() => {
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Native = window[key];
      if (Native) window[key] = new Proxy(Native, {construct(target, args) { void window.__week3AudioConstructed(); return Reflect.construct(target, args); }});
    }
  });
  return async () => { expect(constructions).toBe(0); expect(samples).toEqual([]); expect(await page.evaluate(() => ctx)).toBe(null); };
}
async function progress(page) { await page.locator('.toolbar-menu summary').click(); await page.locator('[data-go="progress"]').click(); }
async function exported(page) {
  const waiting = page.waitForEvent('download'); await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function imported(page, value) {
  await page.locator('#importFile').setInputFiles({name: 'week3-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value))});
}
async function configure(page, settings) {
  await page.goto('http://127.0.0.1:8766/'); await expect(page.locator('#schoolName')).toBeEnabled();
  await page.locator('#settingsFile').setInputFiles({name: 'week3-school.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(settings))});
  await expect(page.locator('#message')).toContainText('importerte');
  await page.locator('#previewSchool').click(); await expect(page.locator('#pupilPreview')).toHaveAttribute('sandbox', 'allow-scripts');
  const frame = page.frameLocator('#pupilPreview'); await expect(b(frame, 'enter')).toHaveCount(settings.programmeEnabled ? 3 : 0); return frame;
}
async function zip(page, info) {
  const button = page.locator('#downloadPackage'); await button.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(button).toBeInViewport(); const waiting = page.waitForEvent('download'); await activate(button, info);
  const folder = path.resolve('.quality/school-sites', 'week3-zip-' + info.project.name + '-' + info.testId.replace(/[^a-z0-9]/gi, ''));
  fs.mkdirSync(folder, {recursive: true}); const archive = folder + '.zip'; await (await waiting).saveAs(archive);
  execFileSync(process.env.PYTHON || 'python3', ['-c', 'import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])', archive, folder]);
  return {folder, url: editions + path.basename(folder) + '/', manifest: JSON.parse(fs.readFileSync(path.join(folder, 'school-package.json')))};
}
const e = (kind, ticks) => ({kind, ticks});
// Independent literal worked measures and COMPLETE repairs from the pre-code review.
// Never call the implementation's accepts() to decide a browser test answer.
const CASES = [
  {id:'debug-1', original:[e('note',2),e('note',4),e('note',4)], repairs:[[e('note',2),e('note',2),e('note',4)],[e('note',2),e('note',4),e('note',2)]]},
  {id:'debug-2', original:[e('note',2),e('note',2),e('note',2)], repairs:[[e('note',4),e('note',2),e('note',2)],[e('note',2),e('note',4),e('note',2)],[e('note',2),e('note',2),e('note',4)]]},
  {id:'debug-3', original:[e('rest',4),e('note',4),e('note',2)], repairs:[[e('rest',4),e('note',2),e('note',2)]]},
  {id:'debug-4', original:[e('note',3),e('note',1),e('rest',2),e('note',1)], repairs:[[e('note',3),e('note',1),e('rest',3),e('note',1)],[e('note',3),e('note',1),e('rest',2),e('note',2)]]},
  {id:'debug-5', original:[e('note',2),e('rest',1),e('note',2),e('note',2),e('note',2)], repairs:[0,2,3,4].map(i => [e('note',2),e('rest',1),e('note',2),e('note',2),e('note',2)].map((v,j) => j === i ? e('note',1) : v))},
  {id:'debug-6', original:[e('rest',4),e('note',1),e('note',1),e('rest',1)], repairs:[[e('rest',4),e('note',2),e('note',1),e('rest',1)],[e('rest',4),e('note',1),e('note',2),e('rest',1)],[e('rest',4),e('note',1),e('note',1),e('rest',2)]]},
  {id:'debug-7', original:Array.from({length:4}, () => e('note',2)), repairs:Array.from({length:4}, (_,i) => Array.from({length:4},(_,j) => e(i === j ? 'rest' : 'note',2)))},
  {id:'debug-8', original:[e('note',6),e('rest',2),e('note',2)], repairs:[[e('note',4),e('rest',2),e('note',2)]]},
];
async function editTo(page, original, target) {
  for (let i=0;i<target.length;i++) if (JSON.stringify(original[i])!==JSON.stringify(target[i])) {
    await b(page,'event',i).click();
    await b(page, original[i].kind!==target[i].kind?'role':'duration',original[i].kind!==target[i].kind?target[i].kind:target[i].ticks).click();
  }
}
for(const [locale,title] of [['nn','Notefeilsøkjaren'],['nb','Notefeilsøkeren'],['en','Notation debugger']])test(`${locale}: three independent entrances and four keyboard/touch configurations without automatic audio`,async({page},info)=>{
 const silent=await noAudio(page);await enter(page,'debug',locale);await expect(page.locator('h1')).toHaveText(title);
 for(const task of ['response','debug','form']){await activate(b(page,'task',task),info);await expect(b(page,'task',task)).toHaveAttribute('aria-pressed','true');for(const level of [1,2,3,4]){await b(page,'level',level).focus();await page.keyboard.press('Enter');await expect(b(page,'level',level)).toBeFocused();await expect(b(page,'level',level)).toHaveAttribute('aria-pressed','true');if(task==='debug'&&level===3)await expect(page.locator('[data-w3-before]')).toBeVisible();}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await b(page,'task','debug').click();await b(page,'event',1).focus();await page.keyboard.press('Space');await expect(b(page,'event',1)).toBeFocused();await b(page,'duration',2).focus();await page.keyboard.press('Enter');await expect(b(page,'duration',2)).toBeFocused();expect(await b(page,'duration',2).evaluate(x=>x.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48);
 const dimensions=await page.locator('[data-w3-current] .w3-events>li').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));expect(dimensions.every(w=>w>=125)).toBe(true);await silent();
});
for(const [index,item]of CASES.entries())test(`${item.id}: construct every independently enumerated musical repair, not a complete-answer quiz`,async({page})=>{
 const silent=await noAudio(page);await enter(page);await b(page,'level',4).click();await b(page,'case',index).click();await expect(page.locator('[data-w3-item]')).toHaveAttribute('data-w3-item',item.id);
 expect(await page.evaluate(()=>w3.events)).toEqual(item.original);await b(page,'check').click();const key=`w3-debug/${item.id}/r1/l4`;expect(await page.evaluate(k=>data.week3Practice.done[k]||0,key)).toBe(0);
 await b(page,'snapshot').click();
 for(const repair of item.repairs){await b(page,'reset').click();await editTo(page,item.original,repair);expect(await page.evaluate(()=>w3.events)).toEqual(repair);await b(page,'check').click();await b(page,'check').click();expect(await page.evaluate(k=>data.week3Practice.done[k],key)).toBe(1);await b(page,'save').click();}
 const saved=await page.evaluate(()=>data.week3Practice.repairs);expect(saved.map(r=>r.events)).toEqual(item.repairs);expect(saved.every(r=>r.previous&&JSON.stringify(r.previous)===JSON.stringify(item.original))).toBe(true);
 await expect(page.locator('[data-w3-before]')).toBeVisible();expect(await page.locator('[data-w3-current] svg[data-w3-symbol]').count()).toBe(item.original.length);await silent();
});
test('interactive undo, locked events, optional total reveal and fixed musical time scale',async({page})=>{
 const silent=await noAudio(page);await enter(page);await b(page,'level',2).click();await expect(page.locator('[data-w3-total]')).toHaveCount(0);await b(page,'event',1).click();await b(page,'duration',2).click();await b(page,'reveal').click();await expect(page.locator('[data-w3-total]')).toContainText('4 / 4');await b(page,'undo').click();expect(await page.evaluate(()=>w3.events)).toEqual(CASES[0].original);
 await b(page,'level',4).click();await b(page,'case',2).click();await expect(b(page,'event',0)).toBeDisabled();await expect(b(page,'event',2)).toBeDisabled();await page.evaluate(()=>w3Action('event','0'));expect(await page.evaluate(()=>w3.selected)).toBe(1);
 await b(page,'case',4).click();for(const i of [0,2,3,4]){await b(page,'event',i).click();await b(page,'duration',4).click();}
 const strip=page.locator('[data-w3-current] .w3-timeline');const last=strip.locator('[data-w3-onset]').last();expect(await last.getAttribute('data-w3-duration')).toBe('2');const bounds=await strip.boundingBox(),end=await last.boundingBox();expect(end.x+end.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);
 const boundary=await strip.locator('.w3-boundary').boundingBox();expect((boundary.x-bounds.x)/bounds.width).toBeCloseTo(4/9,2);await silent();
});
test('scoped response preserves creative drafts, accepts both supplied endings, distinguishes Echo, and cancels real playback on return',async({page})=>{
 await observeAudio(page);await enter(page,'response');await page.evaluate(()=>{cv.level=4;cv.mode='create';cv.brief='home';cvNew();cv.response=cvEvents([60,62,69,60]);cv.previous=cvEvents([60,62,64,60]);});const before=await page.evaluate(()=>JSON.stringify(data));await b(page,'response-link').click();expect(await page.evaluate(()=>({route,level:cv.level,brief:cv.item.brief,mode:cv.mode,echo:cv.echo}))).toEqual({route:'conversation',level:4,brief:'ending',mode:'build',echo:false});expect(await page.evaluate(()=>cv.drafts['4-home'].response)).toEqual([60,62,69,60].map(notes=>({notes,dur:1})));expect(await page.evaluate(()=>JSON.stringify(data))).toBe(before);
 for(const ending of [1,2]){await cvb(page,'clear').click();await cvb(page,'add',0).click();await cvb(page,'add',ending).click();await cvb(page,'check').click();await expect(page.locator('.feedback')).toHaveClass('feedback');expect(await page.evaluate(()=>cvFits(cv.item.call,cv.order.flatMap(i=>cv.item.pieces[i]),'ending'))).toBe(true);}
 expect(await page.evaluate(()=>cvFits(cv.item.call,cv.item.call,'ending'))).toBe(false);await cvb(page,'echo').click();await expect(page.locator('[data-w3-context]')).toHaveAttribute('data-w3-context','explore');expect(await page.evaluate(()=>data.week3Practice.done)).toEqual({});await cvb(page,'echo').click();await cvb(page,'mode','build').click();await cvb(page,'add',0).click();await cvb(page,'add',1).click();await cvb(page,'pair').click();await expect.poll(()=>page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').length)).toBeGreaterThan(0);
 const starts=await page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').map(e=>e.scheduled));expect(starts).toHaveLength(8);for(const i of [1,2,3,5,6,7])expect(starts[i]-starts[i-1]).toBeCloseTo(60/90,4);expect(starts[4]-starts[3]).toBeCloseTo(2*60/90,4);
 await b(page,'return').click();expect(await page.evaluate(()=>({route,sources:sources.length,timers:timers.length}))).toEqual({route:'week3',sources:0,timers:0});await expect.poll(()=>page.evaluate(()=>__audioEvents.filter(e=>e.kind==='stop').length)).toBeGreaterThan(0);
});
test('return while source sample loading cancels stale playback and completion callbacks',async({page})=>{
 await observeAudio(page);let release;const waiting=new Promise(r=>release=r);await page.route('**/sounds/*.mp3',async route=>{await waiting;await route.continue();});await enter(page,'response');await b(page,'response-link').click();await cvb(page,'call').click();await expect.poll(()=>page.evaluate(()=>cv.busy)).toBe(true);await b(page,'return').click();release();await expect.poll(()=>page.evaluate(()=>buffers?.length||0)).toBe(5);await page.waitForTimeout(3000);expect(await page.evaluate(()=>({route,started:__audioEvents.filter(e=>e.kind==='start').length,sources:sources.length,heard:cv.heard}))).toEqual({route:'week3',started:0,sources:0,heard:{}});
});
test('Form construction opens genuine ABA/BAB build, retains saved creation drafts and contextual return',async({page})=>{
 const silent=await noAudio(page);await enter(page,'form');await page.evaluate(()=>{fo.creation=['B','A','B'];fo.previous=['A','B','A'];});const before=await page.evaluate(()=>JSON.stringify(data));await b(page,'form-link').click();expect(await page.evaluate(()=>({route,mode:fo.mode,brief:fo.brief}))).toEqual({route:'form',mode:'build',brief:'return'});expect(await page.evaluate(()=>fo.creation)).toEqual(['B','A','B']);expect(await page.evaluate(()=>fo.previous)).toEqual(['A','B','A']);expect(await page.evaluate(()=>JSON.stringify(data))).toBe(before);
 for(const map of [['A','B','A'],['B','A','B']]){for(const [i,id]of map.entries()){await fob(page,'slot',i).click();await fob(page,'place',id).click();}await fob(page,'check').click();expect(await page.evaluate(()=>foFits(fo.answer,'return'))).toBe(true);}
 await fob(page,'mode','create').click();await expect(page.locator('[data-w3-context]')).toHaveAttribute('data-w3-context','explore');await b(page,'return').click();expect(await page.evaluate(()=>route)).toBe('week3');await silent();
});
test('independent school source restrictions and programme opt-out reject routes/actions without erasing history',async({page})=>{
 for(const restricted of ['conversation','form','both']){const settings=SC.defaults();settings.defaultLanguage='en';settings.levels.programme=[2,4];if(restricted==='conversation')settings.levels.conversation=[2,3];if(restricted==='form')settings.levels.form=[1,3];if(restricted==='both'){settings.themes=['groove'];settings.formEnabled=false;}const frame=await configure(page,settings);for(const task of ['response','form']){await b(frame,'enter',task).click();const denied=restricted==='both'||restricted===(task==='response'?'conversation':'form');if(denied){await expect(frame.locator('[data-w3-unavailable]')).toBeVisible();await expect(frame.locator('[data-w3-item] .fo-card')).toHaveCount(0);await expect(b(frame,task==='response'?'response-link':'form-link')).toHaveCount(0);await frame.locator('body').evaluate(task=>w3Action(task==='response'?'response-link':'form-link'),task);expect(await frame.locator('body').evaluate(()=>route)).toBe('week3');}await frame.locator('.brand').click();}await b(frame,'enter','debug').click();await expect(b(frame,'level')).toHaveCount(2);}
 const settings=SC.defaults();settings.programmeEnabled=false;const frame=await configure(page,settings);const before=await frame.locator('body').evaluate(()=>JSON.stringify(data));await frame.locator('body').evaluate(()=>{go('week3');w3Action('enter','debug');w3Action('response-link');w3Action('form-link');w3Action('save');});expect(await frame.locator('body').evaluate(()=>JSON.stringify(data))).toBe(before);expect(await frame.locator('body').evaluate(()=>route)).not.toBe('week3');
});
test('saved repair survives languages, older backups and settings restrictions; invalid import and cancellation are atomic',async({page})=>{
 let accept=true;page.on('dialog',d=>accept?d.accept():d.dismiss());await enter(page);await b(page,'snapshot').click();await b(page,'event',1).click();await b(page,'duration',2).click();await b(page,'save').click();const saved=await page.evaluate(()=>structuredClone(data.week3Practice));await page.locator('.toolbar-menu summary').click();await page.locator('[data-language="nn"]').click();await page.reload();await page.locator('[data-nv="continue"]').click();await b(page,'open',0).click();expect(await page.evaluate(()=>data.week3Practice)).toEqual(saved);expect(await page.evaluate(()=>w3.previous)).toEqual(CASES[0].original);await progress(page);const backup=await exported(page);backup.groovePractice.done={'listen-2':5};await imported(page,backup);const older=copy(backup);delete older.week3Practice;await imported(page,older);expect(await page.evaluate(()=>data.week3Practice)).toEqual(saved);expect(await page.evaluate(()=>data.groovePractice.done)).toEqual({'listen-2':5});
 for(const field of ['groovePractice','conversationPractice','formPractice','programmePractice','week2Practice','week3Practice']){const bad=copy(backup);bad[field].version=99;const before=await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1')}));await imported(page,bad);await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');expect(await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1')}))).toBe(before);}
 const empty=copy(backup);empty.week3Practice.repairs=[];accept=false;await imported(page,empty);await expect(page.locator('#importFile')).toHaveValue('');expect(await page.evaluate(()=>data.week3Practice)).toEqual(saved);accept=true;await imported(page,empty);expect(await page.evaluate(()=>data.week3Practice.repairs)).toEqual([]);await imported(page,backup);expect(await page.evaluate(()=>data.week3Practice)).toEqual(saved);
});
test('actual isolated school preview and extracted ZIP preserve Week3 controls/locales/offline restrictions and exclude editor',async({page},info)=>{
 const settings=SC.defaults();settings.defaultLanguage='en';settings.levels.programme=[2,4];settings.levels.conversation=[4];settings.levels.form=[4];const frame=await configure(page,settings);for(const task of ['response','debug','form']){await b(frame,'enter',task).click();await expect(b(frame,'task')).toHaveCount(3);await expect(b(frame,'level')).toHaveCount(2);await frame.locator('.brand').click();}const out=await zip(page,info);expect(out.manifest.pupilRelease).toBe('BLOCKED');expect(JSON.parse(fs.readFileSync(path.join(out.folder,'school-settings.json')))).toEqual(settings);
 for(const locale of ['nn','nb','en']){await page.goto(out.url+locale+'.html');await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('#settingsForm,#pupilPreview')).toHaveCount(0);for(const task of ['response','debug','form']){await b(page,'enter',task).click();await expect(b(page,'level')).toHaveCount(2);await page.locator('.brand').click();}}
 await b(page,'enter','debug').click();await page.context().setOffline(true);await b(page,'event',1).click();await b(page,'duration',2).click();await b(page,'check').click();expect(await page.evaluate(()=>data.week3Practice.done['w3-debug/debug-1/r1/l2'])).toBe(1);expect(await page.evaluate(()=>ctx)).toBe(null);await page.context().setOffline(false);
});
test('adult Theme02-only artifact denies Week3 entries, direct routes, source wrappers and save actions',async({page})=>{
 await page.goto('http://127.0.0.1:8767/teacher-kit/teacher-review.html');await page.locator('#openExercise').click();const frame=page.frameLocator('#teacherPreview');await expect(frame.locator('[data-gr-action="reference"]')).toBeVisible();await expect(b(frame,'enter')).toHaveCount(0);const result=await frame.locator('body').evaluate(()=>{const before=JSON.stringify(data);go('week3');w3Action('enter','debug');w3Action('response-link');w3Action('form-link');w3Action('save');return {route,allowed:scRouteAllowed('week3'),unchanged:before===JSON.stringify(data)};});expect(result).toEqual({route:'groove',allowed:false,unchanged:true});await expect(page.locator('#teacherPreview')).toHaveAttribute('sandbox','allow-scripts');
});
