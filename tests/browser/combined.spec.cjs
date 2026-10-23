const fs = require('node:fs');
const {test, expect, observeAudio} = require('./fixtures.cjs');
const historicalBase = require('../fixtures/school-v1-restricted.json');

// Integration, not replacement musical predicates: all module suites remain.
const cv = (page, action, value) => page.locator(`[data-cv-action="${action}"]${value === undefined ? '' : `[data-cv-value="${value}"]`}`);
const fo = (page, action, value) => page.locator(`[data-fo-action="${action}"]${value === undefined ? '' : `[data-fo-value="${value}"]`}`);
const wg = (page, action, value) => page.locator(`[data-wg="${action}"]${value === undefined ? '' : `[data-wg-value="${value}"]`}`);
const progressKeys = ['conversationPractice', 'formPractice', 'programmePractice'];
const snapshot = page => page.evaluate(() => JSON.parse(JSON.stringify({conversationPractice: data.conversationPractice, formPractice: data.formPractice, programmePractice: data.programmePractice})));
async function home(page) { await page.locator('.brand').click(); }
async function openProgress(page) { await page.locator('.toolbar-menu summary').click(); await page.locator('[data-go="progress"]').click(); }
async function exported(page) {
  const waiting = page.waitForEvent('download'); await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function imported(page, value) {
  await page.locator('#importFile').setInputFiles({name: 'combined-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value))});
}
async function createAll(page, locale = 'en', base = '/') {
  await page.goto(base + locale + '.html');
  await page.locator('[data-go="form"]').click(); await fo(page, 'level', 4).click(); await fo(page, 'mode', 'create').click();
  await fo(page, 'snapshot').click(); await fo(page, 'slot', 2).click(); await fo(page, 'place', 'Av').click(); await fo(page, 'save').click();
  await page.selectOption('#themeSelect', '2'); await cv(page, 'level', 2).click(); await cv(page, 'mode', 'create').click();
  await page.selectOption('[data-cv-note="3"]', '69'); await cv(page, 'snapshot').click();
  await page.selectOption('[data-cv-note="3"]', '60'); await cv(page, 'save').click();
  await home(page); await page.locator('[data-go="programme"]').click();
  await wg(page, 'task', 'create').click(); await wg(page, 'level', 4).click(); await wg(page, 'brief', 3).click();
  await wg(page, 'cell', 0).click(); await wg(page, 'snapshot').click(); await wg(page, 'cell', 7).click(); await wg(page, 'save').click();
  return snapshot(page);
}
async function activate(locator, info) { if (info.project.use.hasTouch) await locator.tap(); else await locator.click(); }

for (const locale of ['nn', 'nb', 'en']) test(`combined ${locale}: all three explicit current/before archives survive routes, language, reload and one backup`, async ({page}, info) => {
  const saved = await createAll(page, locale);
  expect(saved.formPractice.creations[0]).toMatchObject({level: 4, map: ['A', 'B', 'Av'], previous: ['A', 'B', 'A']});
  expect(saved.conversationPractice.creations[0].response.map(e => e.notes)).toEqual([60, 62, 64, 60]);
  expect(saved.conversationPractice.creations[0].previous.map(e => e.notes)).toEqual([60, 62, 64, 69]);
  expect(saved.programmePractice.creations[0]).toMatchObject({level: 4, brief: 3, division: 2, pattern: [1, 0, 0, 0, 0, 0, 0, 1], previous: {division: 2, pattern: [1, 0, 0, 0, 0, 0, 0, 0]}});
  // Reopen after changing the agency brief: archive metadata must win.
  await wg(page, 'brief', 1).click(); await activate(wg(page, 'open', 0), info);
  await expect(wg(page, 'brief', 3)).toHaveAttribute('aria-pressed', 'true'); await expect(wg(page, 'cell')).toHaveCount(8);
  await home(page); await page.locator('[data-go="form"]').click();
  await fo(page, 'open', 0).focus(); await page.keyboard.press('Enter');
  expect(await page.evaluate(() => ({map: fo.creation, before: fo.previous}))).toEqual({map: ['A', 'B', 'Av'], before: ['A', 'B', 'A']});
  await page.selectOption('#themeSelect', '2'); await cv(page, 'mode', 'create').click(); await cv(page, 'open', 0).click();
  expect(await snapshot(page)).toEqual(saved);
  await page.locator('.toolbar-menu summary').click(); await page.locator(`[data-language="${locale === 'en' ? 'nn' : 'en'}"]`).click();
  await page.reload(); expect(await snapshot(page)).toEqual(saved);
  await openProgress(page); const backup = await exported(page);
  for (const key of progressKeys) expect(backup[key]).toEqual(saved[key]);
  expect(backup).toHaveProperty('themeEnding'); expect(backup).toHaveProperty('groovePractice');
});

test('combined backups preserve independently absent extensions, exact legacy archives and atomic sibling rejection', async ({page}) => {
  let accept = true; page.on('dialog', dialog => accept ? dialog.accept() : dialog.dismiss());
  await createAll(page); await openProgress(page); const backup = await exported(page);
  // Explicit valid backup fixtures exercise migration, not simulated task success.
  backup.stats.rhythm = {done: 7, correct: 2}; backup.groovePractice.done = {'repair-2': 3}; backup.themeEnding.done = {'listen-1': true};
  backup.conversationPractice.legacyEcho = {version: 1, level: 1, done: {'listen-1': 2}, creations: [{level: 1, call: [60, 62, 64, 67].map(notes => ({notes, dur: 1})), response: [64, 67].map(notes => ({notes, dur: 1}))}]};
  await imported(page, backup); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  const saved = await snapshot(page);
  const legacy = await page.evaluate(() => JSON.stringify({theme: thStore, groove: data.groovePractice, rhythm: data.stats.rhythm}));
  // Every nonempty subset of the three extension fields can be absent.
  for (let mask = 1; mask < 8; mask++) {
    const older = structuredClone(backup); progressKeys.forEach((key, bit) => { if (mask & (1 << bit)) delete older[key]; });
    await imported(page, older); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
    expect(await snapshot(page)).toEqual(saved);
    expect(await page.evaluate(() => JSON.stringify({theme: thStore, groove: data.groovePractice, rhythm: data.stats.rhythm}))).toBe(legacy);
  }
  for (const target of progressKeys) {
    const bad = structuredClone(backup); bad[target].version = 99;
    for (const sibling of progressKeys.filter(key => key !== target)) bad[sibling].creations = [];
    bad.stats.rhythm = {done: 1, correct: 1};
    const before = await page.evaluate(() => JSON.stringify({data, theme: thStore, raw: localStorage.getItem('musikkverkstad-v1')}));
    await imported(page, bad); await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(() => JSON.stringify({data, theme: thStore, raw: localStorage.getItem('musikkverkstad-v1')}))).toBe(before);
    const replacement = structuredClone(backup); replacement[target].creations = [];
    accept = false; await imported(page, replacement); await expect(page.locator('#importFile')).toHaveValue('');
    expect(await snapshot(page)).toEqual(saved);
    accept = true; await imported(page, replacement); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
    expect(await page.evaluate(key => data[key].creations, target)).toEqual([]);
    for (const sibling of progressKeys.filter(key => key !== target)) expect(await page.evaluate(key => data[key], sibling)).toEqual(saved[sibling]);
    await imported(page, backup); expect(await snapshot(page)).toEqual(saved);
  }
});

for (const version of [1, 2, 3, 4, 5]) test(`historical schema ${version} actual admin import/export/preview preserves consent and independent level choices`, async ({page}) => {
  const legacy = structuredClone(historicalBase); legacy.schemaVersion = version; legacy.schoolName = 'Historical ' + version;
  if ([2, 4].includes(version)) { legacy.themes = ['groove', 'conversation']; legacy.levels.conversation = [2, 4]; }
  if ([3, 4, 5].includes(version)) { legacy.formEnabled = true; legacy.levels.form = [3]; }
  if (version === 5) { legacy.programmeEnabled = true; legacy.levels.programme = [2, 4]; }
  await page.goto('http://127.0.0.1:8766/'); await expect(page.locator('#schoolName')).toBeEnabled();
  await page.locator('#settingsFile').setInputFiles({name: 'historical-school.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(legacy))});
  await expect(page.locator('#message')).toContainText('importerte');
  const waiting = page.waitForEvent('download'); await page.locator('#exportSettings').click();
  const current = JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
  expect(current.schemaVersion).toBe(6); expect(current.themes).toEqual(legacy.themes);
  expect(current.formEnabled).toBe([3, 4, 5].includes(version)); expect(current.programmeEnabled).toBe(version === 5);
  for (const [key, levels] of Object.entries(legacy.levels)) expect(current.levels[key]).toEqual(levels);
  expect(current.defaultLanguage).toBe(legacy.defaultLanguage); expect(current.colourPreset).toBe(legacy.colourPreset);
  expect(current.levels.conversation).toEqual([2, 4].includes(version) ? [2, 4] : [1, 2, 3, 4]);
  expect(current.levels.form).toEqual([3, 4, 5].includes(version) ? [3] : [1, 2, 3, 4]);
  expect(current.levels.programme).toEqual(version === 5 ? [2, 4] : [1, 2, 3, 4]);
  await page.locator('#previewSchool').click(); const frame = page.frameLocator('#pupilPreview');
  await expect(frame.locator('#schoolIdentity')).toHaveText(legacy.schoolName);
  expect(await frame.locator('body').evaluate(() => ({schema: schoolSettings.schemaVersion, settings: schoolSettings, conversation: scRouteAllowed('conversation'), form: scRouteAllowed('form'), programme: scRouteAllowed('programme')})))
    .toEqual({schema: 6, settings: current, conversation: [2, 4].includes(version), form: [3, 4, 5].includes(version), programme: version === 5});
  if (version === 5) { await frame.locator('[data-go="programme"]').click(); await expect(frame.locator('[data-wg="level"]')).toHaveCount(2); }
  if (version === 3) { await frame.locator('[data-go="form"]').click(); await expect(frame.locator('[data-fo-action="level"]')).toHaveCount(1); }
});

test('each route retains its own task/configuration in Continue and saved agency briefs reopen after reload', async ({page}) => {
  const saved = await createAll(page);
  await home(page); await page.locator('[data-go="form"]').click(); await fo(page, 'mode', 'build').click();
  await home(page); await page.locator('[data-nv="continue"]').click();
  await expect(fo(page, 'mode', 'build')).toHaveAttribute('aria-pressed', 'true'); await expect(fo(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
  await page.selectOption('#themeSelect', '2'); await cv(page, 'mode', 'build').click();
  await page.reload(); await page.locator('[data-nv="continue"]').click();
  await expect(cv(page, 'mode', 'build')).toHaveAttribute('aria-pressed', 'true'); await expect(cv(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await home(page); await page.locator('[data-go="programme"]').click(); await wg(page, 'task', 'symbol').click();
  await home(page); await page.locator('[data-nv="continue"]').click();
  await expect(wg(page, 'task', 'symbol')).toHaveAttribute('aria-pressed', 'true'); await expect(wg(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
  await wg(page, 'task', 'create').click(); await wg(page, 'brief', 1).click(); await page.reload();
  await page.locator('[data-nv="continue"]').click(); await wg(page, 'open', 0).click();
  await expect(wg(page, 'brief', 3)).toHaveAttribute('aria-pressed', 'true'); await expect(wg(page, 'cell')).toHaveCount(8);
  expect(await page.evaluate(() => ({current: wg.pattern, previous: wg.previous}))).toEqual({current: saved.programmePractice.creations[0].pattern, previous: saved.programmePractice.creations[0].previous});
  expect(await snapshot(page)).toEqual(saved);
});

test('module-specific school opt-outs, independent levels and disabled reopening retain all three archives', async ({page}) => {
  const base = 'http://127.0.0.1:8767/school-sites/';
  const saved = await createAll(page, 'en', base + 'combined/');
  for (const [edition, enabled] of [
    ['conversation', {conversation: true, form: false, programme: false}],
    ['form', {conversation: false, form: true, programme: false}],
    ['programme', {conversation: false, form: false, programme: true}],
    ['combined-no-conversation', {conversation: false, form: true, programme: true}],
    ['combined-no-form', {conversation: true, form: false, programme: true}],
    ['combined-no-programme', {conversation: true, form: true, programme: false}],
    ['combined-none', {conversation: false, form: false, programme: false}],
    ['combined', {conversation: true, form: true, programme: true}],
  ]) {
    await page.goto(base + edition + '/en.html'); expect(await snapshot(page)).toEqual(saved);
    expect(await page.evaluate(() => ({conversation: scRouteAllowed('conversation'), form: scRouteAllowed('form'), programme: scRouteAllowed('programme')}))).toEqual(enabled);
    await openProgress(page);
    for (const [route, factory] of [['conversation', cv], ['form', fo], ['programme', wg]]) {
      const open = factory(page, 'open', 0); await expect(open).toHaveCount(1);
      if (enabled[route]) await expect(open).toBeEnabled(); else await expect(open).toBeDisabled();
    }
    for (const route of ['conversation', 'form', 'programme']) {
      await page.evaluate(route => go(route), route);
      expect(await page.evaluate(expected => route === expected, route)).toBe(enabled[route]);
    }
    expect(await snapshot(page)).toEqual(saved);
  }
  await home(page); await page.locator('[data-go="form"]').click(); await expect(fo(page, 'level')).toHaveCount(2);
  await page.selectOption('#themeSelect', '2'); await expect(cv(page, 'level')).toHaveCount(2);
  await home(page); await page.locator('[data-go="programme"]').click(); await expect(wg(page, 'level')).toHaveCount(2);
  expect(await page.evaluate(() => ({form: data.formPractice.level, conversation: data.conversationPractice.level, programme: data.programmePractice.level})))
    .toEqual({form: 4, conversation: 2, programme: 4});
});

async function observeContexts(page) {
  await page.addInitScript(() => {
    window.__combinedContexts = 0;
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Native = window[key]; if (Native) window[key] = new Proxy(Native, {construct(target, args) {
        window.__combinedContexts++; return Reflect.construct(target, args);
      }});
    }
  });
}
async function visualDestination(page, route) {
  if (route === 'form') {
    await fo(page, 'select', 0).click(); await fo(page, 'select', 2).click(); await fo(page, 'check').click();
    expect(await page.evaluate(() => data.formPractice.done['puzzle-1'])).toBe(1);
  }
  if (route === 'programme') {
    for (let index = 0; index < 4; index++) { await wg(page, 'label', String(index + 1)).click(); await wg(page, 'place', index).click(); }
    await wg(page, 'check').click(); expect(await page.evaluate(() => data.programmePractice.done['w1-pulse-1'])).toBe(1);
  }
}
async function startSource(page, route) {
  await page.goto('/en.html');
  if (route === 'conversation') { await page.selectOption('#themeSelect', '2'); await cv(page, 'call').click(); }
  else { await page.locator('[data-go="programme"]').click(); await wg(page, 'play').click(); }
}
async function activeIds(page) {
  return page.evaluate(() => __audioEvents.filter(e => e.kind === 'start' && !__audioEvents.some(end => end.kind === 'ended' && end.id === e.id)).map(e => e.id));
}

test('fresh combined Form and Week 1 visual completion never constructs native audio or requests samples', async ({page}) => {
  await observeContexts(page); const requests = [];
  page.on('request', request => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(request.url())) requests.push(request.url()); });
  await page.goto('/en.html'); await page.locator('[data-go="form"]').click(); await visualDestination(page, 'form');
  await home(page); await page.locator('[data-go="programme"]').click(); await visualDestination(page, 'programme');
  await page.selectOption('#themeSelect', '2'); expect(await page.evaluate(() => cv.heard)).toEqual({});
  expect(await page.evaluate(() => ({count: __combinedContexts, context: ctx}))).toEqual({count: 0, context: null}); expect(requests).toEqual([]);
});

const transitions = [['conversation', 'programme'], ['conversation', 'form'], ['programme', 'conversation'], ['programme', 'form']];
for (const [source, destination] of transitions) test(`native playing ${source} → ${destination}: stop all sources/timers, no stale heard credit or visual audio`, async ({page}) => {
  await observeAudio(page); await observeContexts(page);
  await startSource(page, source);
  const count = source === 'conversation' ? 4 : 2;
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(count);
  const ids = await activeIds(page); expect(ids.length).toBeGreaterThan(0);
  // Directly exercise the destination's registered route hook. Passing through
  // Home would cancel earlier and would not test this cross-module boundary.
  await page.evaluate(destination => go(destination), destination);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.id === id && e.kind === 'stop' && e.scheduled === 0)), ids)).toBe(true);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.id === id && e.kind === 'ended')), ids)).toBe(true);
  await visualDestination(page, destination);
  // Observe past the original one-bar completion deadline as well as checking
  // the timer registry, so a stray callback cannot award heard credit later.
  await page.waitForTimeout(3100);
  expect(await page.evaluate(() => ({sources: sources.length, timers: timers.length, starts: __audioEvents.filter(e => e.kind === 'start').length, contexts: __combinedContexts, cvBusy: cv.busy, wgBusy: wg.busy, heard: cv.heard.call || false})))
    .toEqual({sources: 0, timers: 0, starts: count, contexts: 1, cvBusy: false, wgBusy: false, heard: false});
});

for (const [source, destination] of transitions) test(`pending real piano ${source} → ${destination}: late loads cannot restart the departed task`, async ({page}) => {
  await observeAudio(page); await observeContexts(page);
  let release, requested = 0; const barrier = new Promise(resolve => { release = resolve; });
  await page.route('**/sounds/*.mp3', async route => { const response = await route.fetch(); requested++; await barrier; await route.fulfill({response}); });
  try {
    await startSource(page, source); await expect.poll(() => requested).toBe(5);
    await page.evaluate(destination => go(destination), destination); await visualDestination(page, destination);
    release(); await expect.poll(() => page.evaluate(() => buffers?.length || 0)).toBe(5); await page.waitForTimeout(300);
    expect(await page.evaluate(() => ({sources: sources.length, timers: timers.length, starts: __audioEvents.filter(e => e.kind === 'start').length, contexts: __combinedContexts, cvBusy: cv.busy, wgBusy: wg.busy, heard: cv.heard.call || false})))
      .toEqual({sources: 0, timers: 0, starts: 0, contexts: 1, cvBusy: false, wgBusy: false, heard: false});
    expect(requested).toBe(5);
  } finally { release(); }
});

test('fresh My practice opens a saved Conversation before its first question without losing any before-version',async({page},info)=>{
 const saved=await createAll(page);await page.reload();expect(await page.evaluate(()=>cv.item)).toBe(null);
 await openProgress(page);await activate(cv(page,'open',0),info);
 await expect(page.locator('[data-cv-note]')).toHaveCount(4);expect(await page.evaluate(()=>({route,mode:cv.mode,brief:cv.brief,response:cv.response,previous:cv.previous}))).toEqual({route:'conversation',mode:'create',brief:saved.conversationPractice.creations[0].brief,response:saved.conversationPractice.creations[0].response,previous:saved.conversationPractice.creations[0].previous});
 expect(await snapshot(page)).toEqual(saved);
});

test('fresh My practice auditions legacy Echo at its historical tempo without requiring or crediting a new question',async({page})=>{
 await observeAudio(page);await createAll(page);await openProgress(page);const backup=await exported(page);
 backup.conversationPractice.legacyEcho={version:1,level:1,done:{'listen-1':2},creations:[{level:1,call:[60,62,64,67].map(notes=>({notes,dur:1})),response:[64,67].map(notes=>({notes,dur:1}))}]};
 page.on('dialog',dialog=>dialog.accept());await imported(page,backup);await page.reload();expect(await page.evaluate(()=>cv.item)).toBe(null);await openProgress(page);await cv(page,'legacy',0).click();
 await expect.poll(()=>page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').length)).toBe(6);
 const times=await page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').map(e=>e.scheduled));
 expect(times[1]-times[0]).toBeCloseTo(60/108,5);expect(times[4]-times[0]).toBeCloseTo(5*60/108,5);expect(await page.evaluate(()=>data.conversationPractice.done)).toEqual(backup.conversationPractice.done);expect(await snapshot(page)).toEqual(Object.fromEntries(progressKeys.map(k=>[k,backup[k]])));
 await cv(page,'stop').click();
});
