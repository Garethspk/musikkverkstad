const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {test, expect} = require('./fixtures.cjs');
const SC = require('../../src/school/config.js');

// Real Chromium interaction/rendering evidence. No speaker, physical-device,
// teacher, pupil or assistive-technology validation is inferred from these tests.
const b = (page, action, value) => page.locator(`[data-w2="${action}"]${value === undefined ? '' : `[data-w2-value="${value}"]`}`);
const editions = 'http://127.0.0.1:8767/school-sites/';
async function activate(locator, info) { if (info.project.use.hasTouch) await locator.tap(); else await locator.click(); }
async function enter(page, task = 'contour', locale = 'en', base = '/') {
  await page.goto(base + locale + '.html');
  await b(page, 'enter', task).click();
  await expect(b(page, 'task')).toHaveCount(3);
}
async function noAudio(page) {
  const requested = []; let constructed = 0;
  page.on('request', r => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(r.url())) requested.push(r.url()); });
  await page.exposeFunction('__week2AudioConstructed', () => { constructed++; });
  await page.addInitScript(() => {
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Native = window[key];
      if (Native) window[key] = new Proxy(Native, {construct(target, args) {
        void window.__week2AudioConstructed(); return Reflect.construct(target, args);
      }});
    }
  });
  return async () => {
    expect(constructed, 'Visual and text tasks must not create native audio').toBe(0);
    expect(requested, 'Visual and text tasks must not request piano samples').toEqual([]);
    expect(await page.evaluate(() => ctx)).toBe(null);
  };
}
async function progress(page) { await page.locator('.toolbar-menu summary').click(); await page.locator('[data-go="progress"]').click(); }
async function exported(page) {
  const waiting = page.waitForEvent('download'); await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function imported(page, value) {
  await page.locator('#importFile').setInputFiles({name: 'week2-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value))});
}
async function zip(page, info) {
  const button = page.locator('#downloadPackage'); await button.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(button).toBeInViewport(); await expect(button).toBeEnabled();
  const waiting = page.waitForEvent('download'); await activate(button, info); const file = await waiting;
  const folder = path.resolve('.quality/school-sites', 'week2-zip-' + info.project.name + '-' + info.testId.replace(/[^a-z0-9]/gi, ''));
  fs.mkdirSync(folder, {recursive: true}); const archive = folder + '.zip'; await file.saveAs(archive);
  execFileSync(process.env.PYTHON || 'python3', ['-c', 'import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])', archive, folder]);
  return {folder, url: editions + path.basename(folder) + '/', manifest: JSON.parse(fs.readFileSync(path.join(folder, 'school-package.json')))};
}

for (const [locale, titles] of [
  ['nn', ['Formdetektiven', 'Melodikontur', 'Øvingsplan']],
  ['nb', ['Formdetektiven', 'Melodikontur', 'Øvingsplan']],
  ['en', ['Form detective', 'Melody contour', 'Practice-plan challenge']],
]) test(`week2 ${locale}: three free entrances, native keyboard/touch, levels, focus and no audio`, async ({page}, info) => {
  const silent = await noAudio(page);
  await page.goto('/' + locale + '.html'); await expect(b(page, 'enter')).toHaveCount(3);
  for (const [i, task] of ['form', 'contour', 'plan'].entries()) {
    if (i) await page.locator('.brand').click();
    await activate(b(page, 'enter', task), info); await expect(page.locator('h1')).toHaveText(titles[i]);
    await expect(b(page, 'task')).toHaveCount(3); await expect(b(page, 'task', task)).toHaveAttribute('aria-pressed', 'true');
    for (const level of [1, 2, 3, 4]) {
      await b(page, 'level', level).focus(); await page.keyboard.press('Enter');
      await expect(b(page, 'level', level)).toHaveAttribute('aria-pressed', 'true');
      await expect(b(page, 'level', level)).toBeFocused();
      if (task !== 'plan') await expect(b(page, 'answer')).toHaveCount(level === 1 ? 2 : level === 2 ? 3 : 4);
    }
    await b(page, 'next').focus(); const first = await page.locator('[data-w2-item]').getAttribute('data-w2-item');
    await page.keyboard.press('Space'); await expect(b(page, 'next')).toBeFocused();
    expect(await page.locator('[data-w2-item]').getAttribute('data-w2-item')).not.toBe(first);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await b(page, 'task', task).evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48);
  }
  await silent();
});

test('Week2 scoped Form brief opens only a school-enabled repeat/contrast configuration and returns', async ({page}) => {
  const silent = await noAudio(page);
  await enter(page, 'form', 'en', editions + 'combined/');
  await b(page, 'level', 4).click(); await b(page, 'form-link').click();
  expect(await page.evaluate(() => ({route, level: fo.level, brief: fo.brief, mode: fo.mode}))).toMatchObject({route: 'form', level: 4, mode: 'puzzle'});
  expect(await page.evaluate(() => ['repeat', 'contrast'].includes(fo.brief))).toBe(true);
  await expect(b(page, 'return')).toBeVisible(); await b(page, 'return').click();
  expect(await page.evaluate(() => route)).toBe('week2'); await expect(b(page, 'task', 'form')).toHaveAttribute('aria-pressed', 'true');
  for (const edition of ['combined-no-form', 'programme']) {
    await enter(page, 'form', 'en', editions + edition + '/');
    await expect(b(page, 'answer')).toHaveCount(0); await expect(b(page, 'form-link')).toHaveCount(0);
    const before = await page.evaluate(() => JSON.stringify(data));
    await page.evaluate(() => { w2Action('answer', 'a'); w2Action('check'); w2Action('form-link'); });
    expect(await page.evaluate(() => JSON.stringify(data))).toBe(before);
    await b(page, 'task', 'contour').click(); await expect(b(page, 'answer')).not.toHaveCount(0);
    await b(page, 'task', 'plan').click(); await expect(b(page, 'choice')).toHaveCount(3);
  }
  await silent();
});

test('school programme opt-out blocks direct, restored, Continue and archive actions without deleting work', async ({page}) => {
  await enter(page, 'plan', 'en', editions + 'combined/');
  await b(page, 'choice', 'fragment').click(); await b(page, 'save').click();
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.week2Practice)));
  expect(saved.plans.length).toBe(1);
  await page.goto(editions + 'combined-no-programme/en.html'); await expect(b(page, 'enter')).toHaveCount(0);
  expect(await page.evaluate(() => scRouteAllowed('week2'))).toBe(false);
  await page.evaluate(() => { go('week2'); w2Action('enter', 'plan'); w2Action('open', '0'); w2Action('save'); });
  expect(await page.evaluate(() => route)).not.toBe('week2'); expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
  expect(await page.evaluate(() => nvValid({route: 'week2', level: 2, mode: 'plan'}))).toBe(null);
  await progress(page); await expect(b(page, 'open', 0)).toBeDisabled(); const backup = await exported(page); expect(backup.week2Practice).toEqual(saved);
  await page.goto(editions + 'combined/en.html'); await b(page, 'enter', 'plan').click(); await b(page, 'open', 0).click();
  expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
});

test('practice choices give revisable consequences, preserve before/current and never become correct-answer scores', async ({page}) => {
  const silent = await noAudio(page); await enter(page, 'plan');
  const initial = await page.evaluate(() => JSON.stringify({stats: data.stats, done: data.week2Practice.done}));
  const seen = new Set();
  for (let trial = 0; trial < 6; trial++) {
    const id = await page.locator('[data-w2-item]').getAttribute('data-w2-item'); seen.add(id);
    const consequences = [];
    await expect(b(page, 'check')).toHaveCount(0);
    for (const choice of ['fragment', 'pulse', 'model']) {
      await b(page, 'choice', choice).click(); await expect(b(page, 'choice', choice)).toHaveAttribute('aria-pressed', 'true');
      consequences.push(await page.locator('[data-w2-consequence]').textContent());
      expect(await page.evaluate(() => JSON.stringify({stats: data.stats, done: data.week2Practice.done}))).toBe(initial);
    }
    expect(new Set(consequences).size, 'Each branch must explain a distinct musical next action/tradeoff').toBe(3);
    await b(page, 'choice', 'fragment').click(); await b(page, 'snapshot').click();
    await b(page, 'choice', 'pulse').click(); await b(page, 'save').click();
    expect(await page.evaluate(() => data.week2Practice.plans.length)).toBe(trial + 1);
    await b(page, 'next').click();
  }
  expect(seen.size).toBe(6);
  const plans = await page.evaluate(() => JSON.parse(JSON.stringify(data.week2Practice.plans)));
  expect(plans.every(p => p.choice === 'pulse' && p.previous === 'fragment')).toBe(true);
  expect(plans.every(p => p.slot === 'w2-plan' && p.type === 'practice-plan' && p.revision === 1)).toBe(true);
  await b(page, 'open', 0).click();
  expect(await page.evaluate(() => ({choice: w2.choice, previous: w2.previous}))).toEqual({choice: 'pulse', previous: 'fragment'});
  expect(await page.evaluate(() => JSON.stringify({stats: data.stats, done: data.week2Practice.done}))).toBe(initial);
  await silent();
});

test('Week2 language/reload and older imports retain saved plans; invalid siblings and cancelled replacement are atomic', async ({page}) => {
  const silent = await noAudio(page); let accept = true;
  page.on('dialog', dialog => accept ? dialog.accept() : dialog.dismiss());
  await enter(page, 'plan'); await b(page, 'level', 3).click();
  await b(page, 'choice', 'model').click(); await b(page, 'snapshot').click(); await b(page, 'choice', 'fragment').click(); await b(page, 'save').click();
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.week2Practice)));
  await page.locator('.toolbar-menu summary').click(); await page.locator('[data-language="nn"]').click();
  expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
  await page.reload(); await page.locator('[data-nv="continue"]').click();
  await expect(b(page, 'task', 'plan')).toHaveAttribute('aria-pressed', 'true'); await expect(b(page, 'level', 3)).toHaveAttribute('aria-pressed', 'true');
  await b(page, 'open', 0).click(); expect(await page.evaluate(() => ({choice: w2.choice, previous: w2.previous}))).toEqual({choice: 'fragment', previous: 'model'});
  await progress(page); const backup = await exported(page);
  // A valid older backup lacks Week2 but may still contain newer Theme02 history.
  backup.groovePractice.done = {'listen-2': 5};
  await imported(page, backup); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  const older = structuredClone(backup); delete older.week2Practice;
  await imported(page, older); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
  expect(await page.evaluate(() => data.groovePractice.done)).toEqual({'listen-2': 5});
  for (const target of ['week2Practice', 'programmePractice', 'conversationPractice', 'formPractice', 'groovePractice']) {
    const bad = structuredClone(backup); bad[target].version = 99; bad.stats.rhythm = {done: 1, correct: 1};
    const before = await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}));
    await imported(page, bad); await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}))).toBe(before);
  }
  const empty = structuredClone(backup); empty.week2Practice.plans = [];
  accept = false; await imported(page, empty); await expect(page.locator('#importFile')).toHaveValue('');
  expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
  accept = true; await imported(page, empty); expect(await page.evaluate(() => data.week2Practice.plans)).toEqual([]);
  await imported(page, backup); expect(await page.evaluate(() => data.week2Practice)).toEqual(saved);
  await silent();
});

test('actual opaque preview and downloaded offline ZIP contain Week2 with school restrictions and no administrator', async ({page}, info) => {
  await page.goto('http://127.0.0.1:8766/'); await expect(page.locator('#schoolName')).toBeEnabled();
  const settings = SC.defaults(); settings.defaultLanguage = 'en'; settings.schoolName = 'Week2 skule'; settings.levels.programme = [2, 4]; settings.levels.form = [4];
  await page.locator('#settingsFile').setInputFiles({name: 'week2-school.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(settings))});
  await expect(page.locator('#message')).toContainText('importerte'); await page.locator('#previewSchool').click();
  const frame = page.frameLocator('#pupilPreview'); await expect(page.locator('#pupilPreview')).toHaveAttribute('sandbox', 'allow-scripts');
  for (const task of ['form', 'contour', 'plan']) {
    await frame.locator('.brand').click(); await b(frame, 'enter', task).click(); await expect(b(frame, 'task')).toHaveCount(3);
    await expect(b(frame, 'level')).toHaveCount(2); await expect(b(frame, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  }
  const out = await zip(page, info); expect(out.manifest.pupilRelease).toBe('BLOCKED');
  expect(out.manifest.files.map(x => x.path)).not.toContain('setup/index.html');
  expect(JSON.parse(fs.readFileSync(path.join(out.folder, 'school-settings.json')))).toEqual(settings);
  for (const locale of ['nn', 'nb', 'en']) {
    await page.goto(out.url + locale + '.html'); await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('#settingsForm, #pupilPreview')).toHaveCount(0);
    for (const task of ['form', 'contour', 'plan']) {
      await page.locator('.brand').click(); await activate(b(page, 'enter', task), info); await expect(b(page, 'task')).toHaveCount(3);
      await expect(b(page, 'level')).toHaveCount(2); await expect(b(page, 'level', 1)).toHaveCount(0);
    }
    expect(fs.readFileSync(path.join(out.folder, locale + '.html'), 'utf8')).not.toContain('previewBootstrap');
  }
  // Everything used by the new visual/text tasks is inside the exported HTML.
  await page.context().setOffline(true);
  await b(page, 'task', 'contour').click(); await b(page, 'next').click(); await b(page, 'task', 'plan').click(); await b(page, 'choice', 'pulse').click();
  await expect(b(page, 'choice', 'pulse')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => ctx)).toBe(null); await page.context().setOffline(false);
});

test('Form-only higher-level restrictions leave Week2 contour and planning free and cannot force a repeat brief', async ({page}) => {
  await page.goto('http://127.0.0.1:8766/'); await expect(page.locator('#schoolName')).toBeEnabled();
  const settings = SC.defaults(); settings.defaultLanguage = 'en'; settings.levels.form = [2, 3];
  await page.locator('#settingsFile').setInputFiles({name: 'week2-form-restricted.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(settings))});
  await expect(page.locator('#message')).toContainText('importerte'); await page.locator('#previewSchool').click(); const frame = page.frameLocator('#pupilPreview');
  await b(frame, 'enter', 'form').click(); await expect(b(frame, 'task')).toHaveCount(3); await expect(b(frame, 'answer')).toHaveCount(0); await expect(b(frame, 'form-link')).toHaveCount(0);
  expect(await frame.locator('body').evaluate(() => w2FormAllowed())).toBe(false);
  await frame.locator('body').evaluate(() => w2Action('form-link'));
  expect(await frame.locator('body').evaluate(() => route)).toBe('week2');
  await b(frame, 'task', 'contour').click(); await expect(b(frame, 'answer')).toHaveCount(2);
  await b(frame, 'task', 'plan').click(); await expect(b(frame, 'choice')).toHaveCount(3);
});

test('adult Theme02 teacher artifact excludes Week2 routes, actions and editing controls', async ({page}) => {
  await page.goto('http://127.0.0.1:8767/teacher-kit/teacher-review.html'); await page.locator('#openExercise').click();
  const frame = page.frameLocator('#teacherPreview'); await expect(frame.locator('[data-gr-action="reference"]')).toBeVisible();
  await expect(b(frame, 'enter')).toHaveCount(0);
  const result = await frame.locator('body').evaluate(() => {
    const before = JSON.stringify(data.week2Practice);
    go('week2'); w2Action('enter', 'plan'); w2Action('choice', 'pulse'); w2Action('save');
    return {route, allowed: scRouteAllowed('week2'), unchanged: before === JSON.stringify(data.week2Practice), themes: schoolSettings.themes};
  });
  expect(result).toEqual({route: 'groove', allowed: false, unchanged: true, themes: ['groove']});
  await expect(frame.locator('[data-w2="task"], #settingsForm')).toHaveCount(0);
  await expect(page.locator('#identity')).toContainText('pupilRelease=BLOCKED');
  await expect(page.locator('#teacherPreview')).toHaveAttribute('sandbox', 'allow-scripts');
});

// Literal musical examples, authored separately from W2Core's predicates. Order
// within each offered bank is allowed to differ; the musical content is fixed.
const CONTOUR_NOTES = [
  [[60,62,64,67],[60,67,64,69],[60,64,67,69],[64,64,64,64]],
  [[69,67,64,60],[69,64,67,60],[69,64,62,60],[60,62,64,67]],
  [[64,64,64,64],[60,60,62,62],[67,67,67],[60,64,69,64]],
  [[60,64,69,64],[60,62,67,69],[67,64,60,64],[62,62,62,62]],
  [[69,64,60,62],[69,67,64,60],[64,64,64,64],[60,62,67,69]],
  [[60,62,62,67],[67,64,62,60],[67,67,64,60],[60,64,67,69]],
  [[60,67,64,60],[64,64,64,64],[67,60,62,67],[60,62,64,69]],
  [[60,67,69],[69,67,60],[62,64,69],[60,60,69]],
];
const TARGETS = ['up','down','level','mixed','mixed','mixed','mixed','up'];
function direction(pitches) {
  if (pitches.slice(1).every((p, i) => p > pitches[i])) return 'up';
  if (pitches.slice(1).every((p, i) => p < pitches[i])) return 'down';
  if (pitches.every(p => p === pitches[0])) return 'level';
  return 'mixed';
}
const signatures = rows => rows.map(row => JSON.stringify(row)).sort();

test('all eight contour cases use original fixed-scale note events and independently verified answer sets', async ({page}) => {
  const silent = await noAudio(page); await enter(page, 'contour'); await b(page, 'level', 3).click();
  const answerPositions = new Set();
  for (let i = 0; i < 8; i++) {
    const item = await page.evaluate(() => JSON.parse(JSON.stringify(w2Item())));
    expect(item.id).toBe('contour-' + (i + 1)); expect(item.kind).toBe(TARGETS[i]);
    expect(signatures(item.options.map(o => o.events.map(e => e.notes)))).toEqual(signatures(CONTOUR_NOTES[i]));
    for (const option of item.options) {
      expect(option.events.reduce((sum, e) => sum + e.dur, 0)).toBe(4);
      expect(option.events.every(e => e.notes >= 60 && e.notes <= 69 && e.dur > 0)).toBe(true);
    }
    const accepted = item.options.filter(o => direction(o.events.map(e => e.notes)) === TARGETS[i]).map(o => o.id);
    const rejected = item.options.filter(o => !accepted.includes(o.id)).map(o => o.id);
    expect(accepted.length).toBeGreaterThan(0); expect(rejected.length).toBeGreaterThan(0);
    answerPositions.add(accepted.join(','));
    await b(page, 'answer', rejected[0]).click(); await b(page, 'check').click();
    const key = `w2-contour/${item.id}/r1/l3`;
    expect(await page.evaluate(key => data.week2Practice.done[key] || 0, key)).toBe(0);
    await b(page, 'answer', rejected[0]).click();
    for (const id of accepted) await b(page, 'answer', id).click();
    await b(page, 'check').click(); await b(page, 'check').click();
    expect(await page.evaluate(key => data.week2Practice.done[key], key)).toBe(1);
    await expect(b(page, 'check')).toBeFocused();
    if (i < 7) await b(page, 'next').click();
  }
  expect(answerPositions.size, 'Fixed answer positions must not solve every musical case').toBeGreaterThan(1);
  // The first contour-1 counterexample finishes higher but reverses internally.
  expect(direction([60,67,64,69])).toBe('mixed'); expect(direction([60,62,62,67])).toBe('mixed');
  expect(direction([60,67,64,60])).toBe('mixed');
  await silent();
});

const FORM_CASES = [
  ['repeat',[0,1],[['A','A'],['A','B'],['B','B'],['A','Av']]],
  ['contrast',[0,1],[['B','A'],['Av','A'],['A','B'],['B','Bv']]],
  ['repeat',[1,2],[['B','A','A'],['A','A','Av'],['A','B','B'],['B','A','B']]],
  ['contrast',[1,2],[['A','A','B'],['B','B','Bv'],['B','B','A'],['A','Av','B']]],
  ['repeat',[0,1],[['Av','Av'],['A','Av'],['Bv','Bv'],['B','Bv']]],
  ['contrast',[0,1],[['A','B','A'],['A','Av','B'],['B','Bv','B'],['Bv','B','A']]],
  ['repeat',[2,3],[['B','Av','Bv','Bv'],['A','A','B','Bv'],['Av','B','Av','Av'],['B','B','Av','A']]],
  ['contrast',[2,3],[['Av','Av','B','A'],['A','B','B','Bv'],['Bv','A','A','B'],['B','A','Av','A']]],
];
const MATERIAL = {A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62]};
test('eight scoped Form challenges compare the indicated actual musical sections, including near-repeat distractors', async ({page}) => {
  const silent = await noAudio(page); await enter(page, 'form'); await b(page, 'level', 3).click();
  for (let i = 0; i < 8; i++) {
    const item = await page.evaluate(() => JSON.parse(JSON.stringify(w2Item())));
    expect(item.id).toBe('form-' + (i + 1)); expect(item.brief).toBe(FORM_CASES[i][0]); expect(item.pair).toEqual(FORM_CASES[i][1]);
    expect(signatures(item.options.map(o => o.map))).toEqual(signatures(FORM_CASES[i][2]));
    // Regression for inspected-pair tracking and the nested mobile half-width defect.
    for (const id of item.options.map(option => option.id)) {
      const map = page.locator(`[data-w2-option="${id}"] .fo-map`);
      await expect(map.locator('[data-w2-inspect="true"]')).toHaveCount(2);
      for (const [index, target] of item.pair.entries()) {
        const marked = map.locator('[data-w2-inspect="true"]').nth(index);
        await expect(marked.locator('.fo-slot-number')).toContainText(`Slot ${target + 1} · Inspect`);
      }
      const widths = await map.locator(':scope > li').evaluateAll(cards => cards.map(card => card.getBoundingClientRect().width));
      expect(widths.every(width => width >= 125), 'Musical cards must remain readable inside each mobile grid track').toBe(true);
    }
    const accepted = item.options.filter(o => {
      const [left, right] = item.pair.map(p => o.map[p]);
      if (item.brief === 'repeat') return JSON.stringify(MATERIAL[left]) === JSON.stringify(MATERIAL[right]);
      // Contrast here is specifically the two opposite base contours, not any change.
      return left === 'A' && right === 'B' || left === 'B' && right === 'A';
    }).map(o => o.id);
    expect(accepted.length).toBeGreaterThan(0);
    for (const id of accepted) await b(page, 'answer', id).click();
    await b(page, 'check').click();
    expect(await page.evaluate(key => data.week2Practice.done[key], `w2-form/${item.id}/r1/l3`)).toBe(1);
    // Existing Formrenderer exposes pitches and beat numbers, never only colours.
    await expect(page.locator('[data-w2-item] [data-fo-section]').first()).toBeVisible();
    expect(await page.locator('[data-w2-item] circle[data-pitch]').count()).toBeGreaterThan(0);
    if (i < 7) await b(page, 'next').click();
  }
  await silent();
});
