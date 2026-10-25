// Independently authored native Week 5 checks from the frozen pre-code examples.
// Chromium viewports/touch emulation are not physical-device, speaker, teacher,
// pupil, translation or human assistive-technology validation.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {test, expect} = require('./fixtures.cjs');
const SC = require('../../src/school/config.js');
const button = (page, action, value) => page.locator(`[data-w5="${action}"]${value === undefined ? '' : `[data-w5-value="${value}"]`}`);
const editions = 'http://127.0.0.1:8767/school-sites/';
const PITCHES = [60, 62, 64, 65, 67, 69];
// Literal review contract, never W5Core predicates or generated answer lists.
const MOTIFS = [
  {notes:[60,62,64,67], ticks:[2,2,2,2], parameter:'pitch', edit:[3], count:5},
  {notes:[67,64,62,60], ticks:[2,2,2,2], parameter:'pitch', edit:[0], count:5},
  {notes:[60,64,62,67], ticks:[1,3,2,2], parameter:'pitch', edit:[1], count:5},
  {notes:[62,64,67,69], ticks:[2,2,2,2], parameter:'pitch', edit:[2,3], count:25},
  {notes:[60,62,64,67], ticks:[2,2,2,2], parameter:'rhythm', edit:[0,1], count:2},
  {notes:[67,65,64,62], ticks:[1,3,2,2], parameter:'rhythm', edit:[2,3], count:2},
  {notes:[60,64,67,64], ticks:[2,1,3,2], parameter:'rhythm', edit:[1,2], count:2},
  {notes:[62,65,69,67], ticks:[2,2,2,2], parameter:'rhythm', edit:[0,3], count:2},
];
const STAFF = [
  {notes:[60,67], positions:[0,4]}, {notes:[64,71], positions:[2,6]},
  {notes:[65,69], positions:[3,5]}, {notes:[74,77], positions:[8,10]},
  {notes:[62,60], positions:[1,0]}, {notes:[69,72], positions:[5,7]},
  {notes:[67,74], positions:[4,8]}, {notes:[76,81], positions:[9,12]},
];
const ROLES = ['melody','answer','pulse','space'];
const ENSEMBLES = [
  {melody:[60,62,64,67], mt:[2,2,2,2], answer:[67,64,62,60], at:[2,2,2,2], pulse:[0,2,4,6,8,10,12,14],
    models:[['melody','answer','pulse','space'],['melody','answer','pulse','melody']]},
  {melody:[64,67], mt:[4,4], answer:[67,65,64,62], at:[2,2,2,2], pulse:[0,4,8,12],
    models:[['melody','pulse','space','space'],['melody','pulse','answer','space']]},
  {melody:[60,64,67,64], mt:[2,2,2,2], answer:[62,65,69,65], at:[2,2,2,2], pulse:[0,2,4,6,8,10,12,14],
    models:[['melody','melody','pulse','space'],['melody','answer','pulse','space']]},
  {melody:[67,64,62,60], mt:[2,2,2,2], answer:[60,62], at:[4,4], pulse:[0,2,4,6],
    models:[['melody','answer','pulse','space'],['melody','space','pulse','space']]},
  {melody:[62,64,65,69], mt:[2,2,2,2], answer:[null,69,67,65,64], at:[4,1,1,1,1], pulse:[0,2,4,6,8,10,12,14],
    models:[['melody','answer','pulse','space'],['melody','answer','space','space']]},
  {melody:[60,64,60,64], mt:[2,2,2,2], answer:[67,64,67,64], at:[2,2,2,2], pulse:[8,10,12,14],
    models:[['melody','answer','space','space'],['melody','answer','pulse','space']]},
];
const source = item => item.notes.map((notes, i) => ({notes, ticks:item.ticks[i]}));
const clone = value => JSON.parse(JSON.stringify(value));
function solutions(item) {
  const result = [], original = source(item), key = item.parameter === 'pitch' ? 'notes' : 'ticks';
  function visit(value, depth) {
    if (depth === item.edit.length) {
      if (value.reduce((sum, event) => sum + event.ticks, 0) === 8) result.push(clone(value));
      return;
    }
    const index = item.edit[depth], domain = key === 'notes' ? PITCHES : [1,2,3,4];
    for (const choice of domain) if (choice !== original[index][key]) {
      const next = clone(value); next[index][key] = choice; visit(next, depth + 1);
    }
  }
  visit(original, 0);
  expect(result).toHaveLength(item.count);
  return result;
}
function timeline(item, role) {
  if (role === 'space') return [{kind:'rest', notes:null, at:0, ticks:16}];
  if (role === 'pulse') return item.pulse.map(at => ({kind:'pulse', notes:null, at, ticks:0}));
  const notes = role === 'melody' ? item.melody : item.answer;
  const lengths = role === 'melody' ? item.mt : item.at;
  let at = role === 'melody' ? 0 : 8;
  const result = role === 'answer' ? [{kind:'rest', notes:null, at:0, ticks:8}] : [];
  notes.forEach((pitch, i) => {result.push({kind:pitch === null ? 'rest' : 'note', notes:pitch, at, ticks:lengths[i]}); at += lengths[i];});
  if (role === 'melody') result.push({kind:'rest', notes:null, at:8, ticks:8});
  return result;
}
async function activate(locator, info) {if (info.project.use.hasTouch) await locator.tap(); else await locator.click();}
async function enter(page, task = 'motif', locale = 'en', base = '/') {
  await page.goto(base + locale + '.html'); await button(page, 'enter', task).click();
  await expect(button(page, 'task')).toHaveCount(3);
}
async function silent(page) {
  let count = 0; const requests = [];
  await page.exposeFunction('__week5AudioMade', () => count++);
  page.on('request', request => {if (/\/sounds\/|\.mp3(?:$|\?)/.test(request.url())) requests.push(request.url());});
  await page.addInitScript(() => {
    for (const key of ['AudioContext','webkitAudioContext']) {
      const Native = window[key];
      if (Native) window[key] = new Proxy(Native, {construct(target, args) {void window.__week5AudioMade(); return Reflect.construct(target, args);}});
    }
  });
  return async () => {expect(count).toBe(0); expect(requests).toEqual([]); expect(await page.evaluate(() => ctx)).toBe(null);};
}
async function configure(page, settings) {
  await page.goto('http://127.0.0.1:8766/');
  await expect(page.locator('#schoolName')).toBeEnabled();
  await page.locator('#settingsFile').setInputFiles({name:'week5-school.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(settings))});
  await expect(page.locator('#message')).toContainText('importerte');
  await page.locator('#previewSchool').click();
  await expect(page.locator('#pupilPreview')).toHaveAttribute('sandbox', 'allow-scripts');
  const frame = page.frameLocator('#pupilPreview');
  await expect(button(frame, 'enter')).toHaveCount(settings.programmeEnabled ? 3 : 0);
  return frame;
}
async function zip(page, info) {
  const control = page.locator('#downloadPackage'); await control.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(control).toBeInViewport(); await expect(control).toBeEnabled();
  const wait = page.waitForEvent('download'); await activate(control, info);
  const folder = path.resolve('.quality/school-sites', 'week5-zip-' + info.project.name + '-' + info.testId.replace(/[^a-z0-9]/gi, ''));
  fs.mkdirSync(folder, {recursive:true}); const archive = folder + '.zip'; await (await wait).saveAs(archive);
  execFileSync(process.env.PYTHON || 'python3', ['-c', 'import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])', archive, folder]);
  return {folder, url:editions + path.basename(folder) + '/', manifest:JSON.parse(fs.readFileSync(path.join(folder, 'school-package.json')))};
}
async function changeMotif(page, item, value) {
  for (const index of item.edit) {
    await button(page, 'event', index).click();
    await button(page, item.parameter === 'pitch' ? 'pitch' : 'ticks', value[index][item.parameter === 'pitch' ? 'notes' : 'ticks']).click();
  }
}
async function progress(page) {await page.locator('.toolbar-menu summary').click(); await page.locator('[data-go="progress"]').click();}
async function exported(page) {
  const wait = page.waitForEvent('download'); await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await wait).path(), 'utf8'));
}
async function imported(page, value) {
  await page.locator('#importFile').setInputFiles({name:'week5-progress.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(value))});
}
async function renderedTimeline(page, part) {
  return page.locator(`[data-w5-role-current] [data-w5-timeline-part="${part}"] [data-w5-event]`).evaluateAll(nodes => nodes.map(node => ({
    kind:node.getAttribute('data-w5-kind'), notes:JSON.parse(node.getAttribute('data-w5-notes')),
    at:Number(node.getAttribute('data-w5-at')), ticks:Number(node.getAttribute('data-w5-ticks')),
  })));
}

for (const [locale, titles] of [
  ['nn',['Motivlaboratoriet','Finn tonen i notesystemet','Samspelsverkstaden']],
  ['nb',['Motivlaboratoriet','Finn tonen i notesystemet','Samspillsverkstedet']],
  ['en',['Motif laboratory','Staff landmarks','Ensemble roles']],
]) test(`${locale}: three independent Week5 entrances, keyboard/touch, chosen configuration, focus and no automatic audio`, async ({page}, info) => {
  const noSound = await silent(page); await page.goto('/' + locale + '.html');
  await expect(button(page, 'enter')).toHaveCount(3);
  for (const [index, task] of ['motif','staff','roles'].entries()) {
    if (index) await page.locator('.brand').click();
    await activate(button(page, 'enter', task), info); await expect(page.locator('h1')).toHaveText(titles[index]);
    await expect(button(page, 'task')).toHaveCount(3);
    for (const level of [1,2,3,4]) {
      await button(page, 'level', level).focus(); await page.keyboard.press('Enter');
      await expect(button(page, 'level', level)).toBeFocused(); await expect(button(page, 'level', level)).toHaveAttribute('aria-pressed','true');
    }
    await button(page, 'next').focus(); await page.keyboard.press('Space'); await expect(button(page, 'next')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await button(page, 'task', task).evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48);
    const controls=await page.locator('[data-w5]:visible').evaluateAll(nodes=>nodes.map(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})));
    expect(controls.length).toBeGreaterThan(0);expect(controls.every(rect=>rect.width>=48&&rect.height>=48)).toBe(true);
  }
  if (locale !== 'en') {
    await button(page, 'task','staff').click(); await button(page, 'level',4).click(); await button(page, 'case',1).click();
    await expect(button(page, 'target',1)).toContainText('H4');
  }
  await noSound();
});

// Keep all 25 two-pitch variants while bounding each real-interaction batch.
// Every batch retains the same 30-second test limit and anti-farming assertions.
for (const [index, item] of MOTIFS.entries()) for (let group=0;group<(index===3?5:1);group++) test(`motif-${index + 1}${index===3?' group '+(group+1)+' of 5':''}: every independently enumerated constrained transformation, original rejection and one practice credit`, async ({page}) => {
  const noSound = await silent(page); await enter(page); await button(page,'level',4).click(); await button(page,'case',index).click();
  expect(await page.evaluate(() => w5.value)).toEqual(source(item));
  const key = `w5-motif/motif-${index + 1}/r1/l4`;
  await button(page,'check').click(); expect(await page.evaluate(k => data.week5Practice.done[k] || 0,key)).toBe(0);
  const allVariants = solutions(item), variants=index===3?allVariants.slice(group*5,group*5+5):allVariants;
  expect(variants).toHaveLength(index===3?5:item.count);
  for (const value of variants) {
    await button(page,'reset').click(); await changeMotif(page,item,value);
    expect(await page.evaluate(() => w5.value)).toEqual(value);
    expect(await page.locator('[data-w5-motif-current] [data-w5-note]').evaluateAll(nodes => nodes.map(n => ({
      notes:Number(n.getAttribute('data-w5-pitch')),ticks:Number(n.getAttribute('data-w5-ticks')),
    })))).toEqual(value);
    await button(page,'check').click(); await button(page,'check').click();
    expect(await page.evaluate(k => data.week5Practice.done[k],key)).toBe(1);
  }
  await button(page,'snapshot').click(); const previous = variants.at(-1);
  await button(page,'reset').click(); await changeMotif(page,item,variants[0]); await button(page,'save').click();
  expect(await page.evaluate(() => data.week5Practice.creations.at(-1))).toMatchObject({slot:'w5-motif',challenge:`motif-${index + 1}`,mode:'brief',value:variants[0],previous});
  await noSound();
});

test('motif interim totals, locked fields, component audit and mode reset preserve ungraded free exploration and saved versions', async ({page}) => {
  const noSound = await silent(page); await enter(page); await button(page,'level',4).click(); await button(page,'case',4).click();
  await expect(page.locator('[data-w5-overflow]')).toHaveCount(0);
  await button(page,'event',0).click(); await button(page,'ticks',1).click();
  expect(await page.evaluate(() => w5.value.map(event => event.ticks))).toEqual([1,2,2,2]);
  await expect(page.locator('[data-w5-total]')).toContainText('3.5');
  await button(page,'check').click(); await button(page,'save').click();
  expect(await page.evaluate(() => data.week5Practice.creations.length)).toBe(0);
  expect(await page.evaluate(() => Object.keys(data.week5Practice.done))).toEqual([]);
  await expect(page.locator('[data-w5-overflow]')).toHaveCount(0);
  await button(page,'ticks',4).click();expect(await page.evaluate(()=>w5.value.map(event=>event.ticks))).toEqual([4,2,2,2]);
  await expect(page.locator('[data-w5-overflow]')).toBeVisible();await button(page,'check').click();await button(page,'save').click();
  expect(await page.evaluate(()=>data.week5Practice.creations.length)).toBe(0);expect(await page.evaluate(()=>Object.keys(data.week5Practice.done))).toEqual([]);
  await button(page,'undo').click();expect(await page.evaluate(()=>w5.value.map(event=>event.ticks))).toEqual([1,2,2,2]);
  await button(page,'undo').click(); expect(await page.evaluate(() => w5.value)).toEqual(source(MOTIFS[4]));
  const locked = await page.evaluate(() => JSON.stringify(w5.value));
  await page.evaluate(() => {w5Action('event','2');w5Action('ticks','4');w5Action('pitch','69');});
  expect(await page.evaluate(() => JSON.stringify(w5.value))).toBe(locked);
  await button(page,'level',2).click(); await expect(page.locator('[data-w5-motif-audit]')).toBeVisible();
  await expect(page.locator('[data-w5-mode-warning]')).toBeVisible();
  const ordered = await page.locator('[data-w5-mode-warning]').evaluate(node => {
    const control=document.querySelector('[data-w5="mode"]');return !!(node.compareDocumentPosition(control)&Node.DOCUMENT_POSITION_FOLLOWING);
  }); expect(ordered).toBe(true);
  await button(page,'mode','free').click(); await expect(button(page,'check')).toHaveCount(0);
  const done = await page.evaluate(() => JSON.stringify(data.week5Practice.done));
  await button(page,'save').click(); expect(await page.evaluate(() => data.week5Practice.creations.at(-1).mode)).toBe('free');
  await button(page,'event',0).click(); await button(page,'pitch',69).click();
  await button(page,'level',3).click(); expect(await page.evaluate(() => w5.value[0].notes)).toBe(69);
  await expect(page.locator('[data-w5-before]')).toBeVisible();
  await page.evaluate(() => w5Action('check'));
  expect(await page.evaluate(() => JSON.stringify(data.week5Practice.done))).toBe(done);
  await button(page,'mode','brief').click(); expect(await page.evaluate(() => w5.value)).toEqual(source(MOTIFS[4]));
  expect(await page.evaluate(() => data.week5Practice.creations.length)).toBe(1);
  await noSound();
});

test('eight staff constructions use literal treble positions, selected targets, correct clef/ledger geometry and retained before/current versions', async ({page}, info) => {
  const noSound = await silent(page); await enter(page,'staff'); await button(page,'level',4).click();
  for (const [index,item] of STAFF.entries()) {
    await button(page,'case',index).click(); await button(page,'check').click();
    const key=`w5-staff/landmark-${index+1}/r1/l4`;
    expect(await page.evaluate(k=>data.week5Practice.done[k]||0,key)).toBe(0);
    await button(page,'target',0).click(); await expect(button(page,'target',0)).toHaveAttribute('aria-pressed','true');
    await button(page,'position',item.positions[0]).click();
    await button(page,'target',1).click(); await button(page,'position',(item.positions[1]+1)%13).click();
    await button(page,'check').click(); expect(await page.evaluate(k=>data.week5Practice.done[k]||0,key)).toBe(0);
    await button(page,'snapshot').click(); const before=await page.evaluate(()=>structuredClone(w5.value));
    await button(page,'position',item.positions[1]).click(); await button(page,'check').click(); await button(page,'check').click();
    expect(await page.evaluate(()=>w5.value)).toEqual(item.positions);
    expect(await page.evaluate(k=>data.week5Practice.done[k],key)).toBe(1);
    for (const [target,position] of item.positions.entries()) {
      const note=page.locator(`[data-w5-staff] [data-w5-staff-note="${target}"]`);
      await expect(note).toHaveAttribute('data-w5-position',String(position));
      await expect(note).toHaveAttribute('data-w5-pitch',String(item.notes[target]));
      await expect(note).toHaveAttribute('cy',String(118-position*5));
    }
    await button(page,'save').click(); expect(await page.evaluate(()=>data.week5Practice.creations.at(-1))).toMatchObject({slot:'w5-staff',value:item.positions,previous:before});
    if (index===0||index===7) await page.locator('[data-w5-staff]').screenshot({path:info.outputPath(index===0?'week5-clef-C4-G4.png':'week5-upper-ledger-A5.png')});
  }
  const lines=await page.locator('[data-w5-staff] [data-w5-staff-line]').evaluateAll(nodes=>nodes.map(node=>[Number(node.getAttribute('data-w5-staff-line')),Number(node.getAttribute('y1')),Number(node.getAttribute('y2'))]));
  expect(lines).toEqual([[2,108,108],[4,98,98],[6,88,88],[8,78,78],[10,68,68]]);
  await expect(page.locator('[data-w5-staff] [data-w5-clef]')).toHaveText('𝄞');
  const ledger=page.locator('[data-w5-staff] [data-w5-ledger="1"]');await expect(ledger).toHaveAttribute('data-w5-position','12');await expect(ledger).toHaveAttribute('y1','58');
  await noSound();
});

test('staff reference remains available, up/down moves one diatonic step, configuration changes retain placement and focus', async ({page}) => {
  await enter(page,'staff');await button(page,'target',0).click();await button(page,'position',0).click();
  await expect(button(page,'down')).toBeDisabled();await button(page,'up').focus();await page.keyboard.press('Enter');
  await expect(button(page,'up')).toBeFocused();expect(await page.evaluate(()=>w5.value)).toEqual([1,null]);
  await button(page,'down').click();expect(await page.evaluate(()=>w5.value)).toEqual([0,null]);
  for (const level of [1,2,3,4]) {
    await button(page,'level',level).click();expect(await page.evaluate(()=>w5.value)).toEqual([0,null]);
    const reference=page.locator('[data-w5-reference]');await expect(reference.locator('summary')).toBeVisible();
    if (!(await reference.evaluate(node=>node.open))) await reference.locator('summary').click();
    await expect(reference).toContainText('C4');await expect(reference).toContainText('G4');
  }
  await button(page,'level',2).click();await expect(page.locator('[data-w5-staff-anchors]')).toBeVisible();
  await button(page,'target',1).click();await button(page,'position',12).click();await expect(button(page,'up')).toBeDisabled();
  await button(page,'down').click();expect(await page.evaluate(()=>w5.value)).toEqual([0,11]);
});

test('six quartet contexts expose both literal musical models, actual two-bar timelines and non-graded contextual consequences', async ({page}) => {
  const noSound=await silent(page);await enter(page,'roles');await button(page,'level',4).click();
  const done=await page.evaluate(()=>JSON.stringify(data.week5Practice.done));
  for (const [index,item] of ENSEMBLES.entries()) {
    await button(page,'case',index).click();await button(page,'model',1).click();
    expect(await page.evaluate(()=>w5.previous)).toEqual(item.models[0]);
    await expect(page.locator('[data-w5-roles-comparison]')).toBeVisible();
    await expect(page.locator('[data-w5-roles-comparison]')).not.toBeEmpty();
    for (const model of [1,0]) {
      await button(page,'model',model).click();expect(await page.evaluate(()=>w5.value)).toEqual(item.models[model]);
      await expect(page.locator('[data-w5-role-context]')).toBeVisible();
      await expect(page.locator('[data-w5-role-context]')).not.toBeEmpty();
      const order=await page.locator('[data-w5-role-context]').evaluate(node=>({context:!!(node.compareDocumentPosition(document.querySelector('[data-w5-role-current]'))&Node.DOCUMENT_POSITION_FOLLOWING),comparison:!!(document.querySelector('[data-w5-roles-comparison]').compareDocumentPosition(document.querySelector('[data-w5-role-current]'))&Node.DOCUMENT_POSITION_FOLLOWING)}));expect(order).toEqual({context:true,comparison:true});
      for (const [part,role] of item.models[model].entries()) {
        const expected=timeline(item,role);expect(await renderedTimeline(page,part)).toEqual(expected);
        const labels=await page.locator(`[data-w5-role-current] [data-w5-timeline-part="${part}"] [data-w5-event] small`).allTextContents();
        expect(labels.map(label=>label.match(/Bar \d+ · Beat [\d.]+/)?.[0])).toEqual(expected.map(event=>`Bar ${Math.floor(event.at/8)+1} · Beat ${event.at%8/2+1}`));
      }
      for (const role of ROLES) {
        const count=item.models[model].filter(id=>id===role).length;
        await expect(page.locator(`[data-w5-role-count="${role}"]`)).toHaveAttribute('data-w5-count',String(count));
        if(role!=='space') {
          const first=timeline(item,role).find(event=>event.kind!=='rest')?.at;
          await expect(page.locator(`[data-w5-role-entry="${role}"]`)).toHaveAttribute('data-w5-at',count&&first!==undefined?String(first):'none');
        }
      }
      await button(page,'save').click();
    }
  }
  expect(await page.evaluate(()=>data.week5Practice.creations.length)).toBe(12);
  expect(await page.evaluate(()=>JSON.stringify(data.week5Practice.done))).toBe(done);
  await expect(button(page,'check')).toHaveCount(0);await noSound();
});

test('an explicit ensemble role edit snapshots previous parts, changes entry events, supports undo and accepts all-space exploration without a score', async ({page}) => {
  const noSound=await silent(page);await enter(page,'roles');await button(page,'level',4).click();await button(page,'case',2).click();
  const initial=ENSEMBLES[2].models[0];expect(await page.evaluate(()=>w5.previous)).toBe(null);
  await button(page,'part',1).click();await button(page,'role','answer').focus();await page.keyboard.press('Enter');await expect(button(page,'role','answer')).toBeFocused();
  expect(await page.evaluate(()=>w5.previous)).toEqual(initial);expect(await page.evaluate(()=>w5.value)).toEqual(ENSEMBLES[2].models[1]);
  expect(await renderedTimeline(page,1)).toEqual(timeline(ENSEMBLES[2],'answer'));
  await button(page,'undo').click();expect(await page.evaluate(()=>w5.value)).toEqual(initial);
  for (let part=0;part<4;part++) {await button(page,'part',part).click();await button(page,'role','space').click();}
  const done=await page.evaluate(()=>JSON.stringify(data.week5Practice.done));await expect(button(page,'check')).toHaveCount(0);
  await page.evaluate(()=>w5Action('check'));await button(page,'save').click();
  expect(await page.evaluate(()=>data.week5Practice.creations.at(-1).value)).toEqual(['space','space','space','space']);
  expect(await page.evaluate(()=>JSON.stringify(data.week5Practice.done))).toBe(done);
  for (let part=0;part<4;part++) expect(await renderedTimeline(page,part)).toEqual([{kind:'rest',notes:null,at:0,ticks:16}]);
  for (const level of [1,2,3,4]) {
    await button(page,'level',level).click();await expect(page.locator('[data-w5-role-context]')).toBeVisible();await expect(page.locator('[data-w5-role-count="melody"]')).toHaveAttribute('data-w5-count','0');
    if(level===3){const windows=page.locator('[data-w5-attack-windows]');for(let beat=0;beat<8;beat++)await expect(windows).toContainText(`Bar ${Math.floor(beat/4)+1} · Beat ${beat%4+1}`);await expect(windows).toContainText('an earlier note may continue');await expect(windows).not.toContainText('Beat 5');}
  }
  await noSound();
});

test('Week5 and older module histories survive language/reload and older backups; invalid sibling imports and cancelled replacement stay atomic', async ({page}) => {
  let accept=true;page.on('dialog',dialog=>accept?dialog.accept():dialog.dismiss());
  await enter(page);await button(page,'event',3).click();await button(page,'pitch',69).click();await button(page,'save').click();
  await button(page,'task','staff').click();await button(page,'target',0).click();await button(page,'position',0).click();await button(page,'target',1).click();await button(page,'position',4).click();await button(page,'save').click();
  await button(page,'task','roles').click();await button(page,'model',1).click();await button(page,'save').click();
  await page.evaluate(()=>{data.groovePractice.done={'listen-2':7};data.week4Practice.done={'w4-paths/path-1/r1/l1':3};thStore.done={'listen-2':true};save();thPersist();});
  const saved=await page.evaluate(()=>structuredClone(data.week5Practice));
  await page.locator('.toolbar-menu summary').click();await page.locator('[data-language="nn"]').click();await page.reload();await page.locator('[data-nv="continue"]').click();
  expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);expect(await page.evaluate(()=>route)).toBe('week5');
  await button(page,'open',0).click();expect(await page.evaluate(()=>w5.value)).toEqual([{notes:60,ticks:2},{notes:62,ticks:2},{notes:64,ticks:2},{notes:69,ticks:2}]);
  await progress(page);const backup=await exported(page),older=clone(backup);delete older.week5Practice;delete older.week4Practice;delete older.groovePractice;
  await imported(page,older);expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);expect(await page.evaluate(()=>data.groovePractice.done)).toEqual({'listen-2':7});expect(await page.evaluate(()=>data.week4Practice.done)).toEqual({'w4-paths/path-1/r1/l1':3});
  for (const field of ['groovePractice','conversationPractice','formPractice','programmePractice','week2Practice','week3Practice','week4Practice','week5Practice']) {
    const bad=clone(backup);bad[field].version=99;
    const before=await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1'),themeRaw:localStorage.getItem('musikkverkstad-theme-ending-v1')}));
    await imported(page,bad);await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1'),themeRaw:localStorage.getItem('musikkverkstad-theme-ending-v1')}))).toBe(before);
  }
  // Imported identity fields are strings, not public-API item objects.
  for (let index=0;index<3;index++) {
    const bad=clone(backup);bad.week5Practice.creations[index].challenge={id:bad.week5Practice.creations[index].challenge};
    const before=await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1'),themeRaw:localStorage.getItem('musikkverkstad-theme-ending-v1')}));
    await imported(page,bad);await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(()=>JSON.stringify({data,thStore,raw:localStorage.getItem('musikkverkstad-v1'),themeRaw:localStorage.getItem('musikkverkstad-theme-ending-v1')}))).toBe(before);
  }
  const empty=clone(backup);empty.week5Practice.creations=[];accept=false;await imported(page,empty);await expect(page.locator('#importFile')).toHaveValue('');expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);
  accept=true;await imported(page,empty);expect(await page.evaluate(()=>data.week5Practice.creations)).toEqual([]);await imported(page,backup);expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);
});

test('real schema6 source restrictions and school [2,4] supports preserve preference while neutral Week5 activities remain independent', async ({page}) => {
  const settings=SC.defaults();settings.defaultLanguage='en';settings.themes=['groove'];settings.formEnabled=false;settings.levels.notation=[3];settings.levels.programme=[2,4];
  const frame=await configure(page,settings);
  const before=await frame.locator('body').evaluate(()=>JSON.stringify({form:data.formPractice,conversation:data.conversationPractice,notation:data.extraPractice.notation}));
  await button(frame,'enter','roles').click();await expect(button(frame,'level',2)).toHaveAttribute('aria-pressed','true');await expect(page.locator('#pupilPreview')).toHaveAttribute('sandbox','allow-scripts');await expect(frame.locator('[data-w5-before]')).toBeVisible();
  expect(await frame.locator('body').evaluate(()=>data.week5Practice.level)).toBe(1);
  await button(frame,'recommended').click();await expect(frame.locator('[data-w5-case-number]')).toHaveAttribute('data-w5-case-number','3');await expect(button(frame,'level',2)).toHaveAttribute('aria-pressed','true');expect(await frame.locator('body').evaluate(()=>data.week5Practice.level)).toBe(1);
  for (const task of ['motif','staff','roles']) {await button(frame,'task',task).click();await expect(button(frame,'level')).toHaveCount(2);}
  await expect(frame.locator('[data-w5-role-context]')).toBeVisible();
  expect(await frame.locator('body').evaluate(()=>({form:scRouteAllowed('form'),conversation:scRouteAllowed('conversation'),notation:scLevels('notation'),route}))).toEqual({form:false,conversation:false,notation:[3],route:'week5'});
  expect(await frame.locator('body').evaluate(()=>JSON.stringify({form:data.formPractice,conversation:data.conversationPractice,notation:data.extraPractice.notation}))).toBe(before);
});

test('actual school edition changes preserve saved work and language while programme opt-out denies restored, direct and archive access', async ({page}) => {
  await enter(page,'roles','en',editions+'programme/');await button(page,'model',1).click();await button(page,'save').click();
  const saved=await page.evaluate(()=>structuredClone(data.week5Practice));
  await page.evaluate(()=>localStorage.setItem('musikkverkstad-language','en'));
  await page.goto(editions+'updated/en.html');await expect(button(page,'enter')).toHaveCount(0);expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);
  const before=await page.evaluate(()=>JSON.stringify(data));
  await page.evaluate(()=>{go('week5');w5Action('enter','motif');w5Action('open','0');w5Action('save');nvLast={route:'week5',level:2,mode:'roles'};nvContinue();});
  expect(await page.evaluate(()=>route)).not.toBe('week5');expect(await page.evaluate(()=>JSON.stringify(data))).toBe(before);
  expect(await page.evaluate(()=>localStorage.getItem('musikkverkstad-language'))).toBe('en');
  await page.goto(editions+'programme/en.html');expect(await page.evaluate(()=>data.week5Practice)).toEqual(saved);await progress(page);await button(page,'open',0).click();expect(await page.evaluate(()=>w5.value)).toEqual(ENSEMBLES[0].models[1]);
});

test('actual opaque preview and extracted ZIP retain Week5, languages, restrictions, offline editing and editor exclusion', async ({page},info) => {
  const settings=SC.defaults();settings.defaultLanguage='en';settings.schoolName='Veke5 skule';settings.levels.programme=[2,4];settings.formEnabled=false;settings.themes=['groove'];
  const frame=await configure(page,settings);await page.evaluate(()=>localStorage.setItem('week5-parent-sentinel','real parent value'));
  const child=page.frames().find(candidate=>candidate.parentFrame());
  expect(await child.evaluate(()=>{try{return parent.document.title;}catch{return 'denied';}})).toBe('denied');
  expect(await child.evaluate(()=>localStorage.getItem('week5-parent-sentinel'))).toBe(null);
  await expect(frame.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content',/connect-src 'none'/);
  for (const task of ['motif','staff','roles']) {await button(frame,'enter',task).click();await expect(button(frame,'level')).toHaveCount(2);await frame.locator('.brand').click();}
  const out=await zip(page,info);expect(out.manifest.pupilRelease).toBe('BLOCKED');expect(JSON.parse(fs.readFileSync(path.join(out.folder,'school-settings.json')))).toEqual(settings);expect(out.manifest.files.map(file=>file.path)).not.toContain('setup/index.html');
  for (const locale of ['nn','nb','en']) {
    const html=fs.readFileSync(path.join(out.folder,locale+'.html'),'utf8');expect(html).not.toContain('SchoolPackage');expect(html).not.toContain('SCHOOL_PREVIEW_ADAPTER');
    await page.goto(out.url+locale+'.html');await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('#settingsForm,#pupilPreview')).toHaveCount(0);
    for (const task of ['motif','staff','roles']) {await button(page,'enter',task).click();await expect(button(page,'level')).toHaveCount(2);await page.locator('.brand').click();}
  }
  await button(page,'enter','roles').click();await page.context().setOffline(true);await button(page,'part',3).click();await button(page,'role','melody').click();await button(page,'save').click();
  expect(await page.evaluate(()=>data.week5Practice.creations.at(-1).slot)).toBe('w5-roles');expect(await page.evaluate(()=>ctx)).toBe(null);await page.context().setOffline(false);
});

test('visible case numbers and teacher recommendations retain chosen support, and dotted-quarter augmentation stays beside its notehead',async({page},info)=>{
  await enter(page);await button(page,'level',4).click();await button(page,'case',2).click();
  const svg=page.locator('[data-w5-motif-current] [data-w5-note="1"] svg'),dot=svg.locator('circle'),head=svg.locator('ellipse');
  await expect(dot).toHaveAttribute('cx','45');await expect(dot).toHaveAttribute('cy','47');await expect(head).toHaveAttribute('cx','24');await expect(head).toHaveAttribute('cy','47');
  expect(await dot.evaluate(node=>Number(node.getAttribute('cx')))).toBeGreaterThan(await head.evaluate(node=>Number(node.getAttribute('cx'))+Number(node.getAttribute('rx'))));
  await svg.screenshot({path:info.outputPath('week5-dotted-quarter.png')});
  for(const level of [1,2,3,4]){await button(page,'level',level).click();await expect(page.locator('[data-w5-case-number]')).toHaveAttribute('data-w5-case-number','3');await expect(page.locator('[data-w5-case-number]')).toBeVisible();}
  await button(page,'level',2).click();await button(page,'recommended').click();await expect(page.locator('[data-w5-item]')).toHaveAttribute('data-w5-item','motif-1');await expect(button(page,'level',2)).toHaveAttribute('aria-pressed','true');
  for(const [task,caseIndex,target]of [['staff',3,'landmark-1'],['roles',5,'roles-3']]){await button(page,'task',task).click();await button(page,'level',4).click();await button(page,'case',caseIndex).click();await button(page,'level',2).click();await button(page,'recommended').click();await expect(page.locator('[data-w5-item]')).toHaveAttribute('data-w5-item',target);await expect(button(page,'level',2)).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>data.week5Practice.level)).toBe(2);}
});

test('adult Theme02-only teacher artifact denies every Week5 route and save action without exposing setup', async ({page}) => {
  await page.goto('http://127.0.0.1:8767/teacher-kit/teacher-review.html');await page.locator('#openExercise').click();
  const frame=page.frameLocator('#teacherPreview');await expect(frame.locator('[data-gr-action="reference"]')).toBeVisible();await expect(button(frame,'enter')).toHaveCount(0);
  const result=await frame.locator('body').evaluate(()=>{const before=JSON.stringify(data);go('week5');for(const task of ['motif','staff','roles'])w5Action('enter',task);w5Action('open','0');w5Action('save');return {route,allowed:scRouteAllowed('week5'),unchanged:JSON.stringify(data)===before};});
  expect(result).toEqual({route:'groove',allowed:false,unchanged:true});await expect(page.locator('#teacherPreview')).toHaveAttribute('sandbox','allow-scripts');await expect(frame.locator('#settingsForm,#pupilPreview')).toHaveCount(0);
});
