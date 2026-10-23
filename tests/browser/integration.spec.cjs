const fs = require('node:fs');
const {test, expect, observeAudio} = require('./fixtures.cjs');
const v1Settings = require('../fixtures/school-v1-restricted.json');

// Combined integration only: module-specific musical predicates and audio pitch
// oracles remain in the dedicated Form and Conversation suites.
const foButton = (page, action, value) => page.locator(`[data-fo-action="${action}"]${value === undefined ? '' : `[data-fo-value="${value}"]`}`);
const cvButton = (page, action, value) => page.locator(`[data-cv-action="${action}"]${value === undefined ? '' : `[data-cv-value="${value}"]`}`);
async function openForm(page) {
  await page.locator('.brand').click();
  await page.locator('[data-go="form"]').click();
}
async function openProgress(page) {
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
}
async function exported(page) {
  const waiting = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function importBackup(page, value) {
  await page.locator('#importFile').setInputFiles({name: 'combined-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value))});
}
async function seedBothThroughUI(page, locale = 'en', base = '/') {
  await page.goto(base + locale + '.html');
  await page.locator('[data-go="form"]').click();
  await foButton(page, 'mode', 'create').click();
  await foButton(page, 'snapshot').click();
  await foButton(page, 'slot', 2).click();
  await foButton(page, 'place', 'Av').click();
  await foButton(page, 'save').click();
  await page.selectOption('#themeSelect', '2');
  await cvButton(page, 'mode', 'create').click();
  await page.selectOption('[data-cv-note="3"]', '69');
  await cvButton(page, 'snapshot').click();
  await page.selectOption('[data-cv-note="3"]', '60');
  await cvButton(page, 'save').click();
  return page.evaluate(() => JSON.parse(JSON.stringify({form: data.formPractice, conversation: data.conversationPractice})));
}
const bothProgress = page => page.evaluate(() => ({form: data.formPractice, conversation: data.conversationPractice}));

for (const locale of ['nn', 'nb', 'en']) test(`combined ${locale}: both saved before-versions survive route, language, reload and one real backup`, async ({page}) => {
  const saved = await seedBothThroughUI(page, locale);
  expect(saved.form.creations[0]).toMatchObject({map: ['A', 'B', 'Av'], previous: ['A', 'B', 'A']});
  expect(saved.conversation.creations[0].response.map(e => e.notes)).toEqual([60, 62, 64, 60]);
  expect(saved.conversation.creations[0].previous.map(e => e.notes)).toEqual([60, 62, 64, 69]);
  await openForm(page);
  await foButton(page, 'open', 0).click();
  expect(await page.evaluate(() => ({map: fo.creation, previous: fo.previous}))).toEqual({map: ['A', 'B', 'Av'], previous: ['A', 'B', 'A']});
  await page.selectOption('#themeSelect', '2');
  await cvButton(page, 'mode', 'create').click();
  await cvButton(page, 'open', 0).click();
  expect(await bothProgress(page)).toEqual(saved);
  await page.locator('.toolbar-menu summary').click();
  const nextLocale = locale === 'en' ? 'nn' : 'en';
  await page.locator(`[data-language="${nextLocale}"]`).click();
  expect(await bothProgress(page)).toEqual(saved);
  await page.reload();
  await page.locator('[data-nv="continue"]').click();
  await expect(cvButton(page, 'mode', 'create')).toHaveAttribute('aria-pressed', 'true');
  expect(await bothProgress(page)).toEqual(saved);
  await openProgress(page);
  const backup = await exported(page);
  expect(backup.formPractice).toEqual(saved.form);
  expect(backup.conversationPractice).toEqual(saved.conversation);
  expect(backup).toHaveProperty('groovePractice');
  expect(backup).toHaveProperty('themeEnding');
});

test('combined backup: each missing optional field preserves its newer work; invalid sibling rejects all changes atomically', async ({page}) => {
  page.on('dialog', dialog => dialog.accept());
  const saved = await seedBothThroughUI(page);
  await openProgress(page);
  const original = await exported(page);
  // Explicit supported backup fixtures, not simulated claims of task completion.
  original.stats.rhythm = {done: 7, correct: 3};
  original.groovePractice.done = {'repair-2': 4};
  await importBackup(page, original);
  await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  for (const absent of [['formPractice'], ['conversationPractice'], ['formPractice', 'conversationPractice']]) {
    const older = structuredClone(original);
    for (const key of absent) delete older[key];
    await importBackup(page, older);
    await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
    expect(await bothProgress(page)).toEqual(saved);
    expect(await page.evaluate(() => ({rhythm: data.stats.rhythm, groove: data.groovePractice.done}))).toEqual({rhythm: {done: 7, correct: 3}, groove: {'repair-2': 4}});
  }
  for (const corrupt of [
    value => { value.formPractice.creations[0].map[0] = 'X'; value.conversationPractice.creations = []; },
    value => { value.conversationPractice.creations[0].response[0].dur = 0.5; value.formPractice.creations = []; },
    value => { delete value.formPractice; value.conversationPractice.version = 99; },
    value => { delete value.conversationPractice; value.formPractice.version = 99; },
  ]) {
    const before = await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}));
    const invalid = structuredClone(original); corrupt(invalid);
    await importBackup(page, invalid);
    await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}))).toBe(before);
  }
  for (const target of ['formPractice', 'conversationPractice']) {
    const replace = structuredClone(original); replace[target].creations = [];
    await importBackup(page, replace);
    expect(await page.evaluate(key => data[key].creations, target)).toEqual([]);
    const sibling = target === 'formPractice' ? 'conversationPractice' : 'formPractice';
    expect(await page.evaluate(key => data[key], sibling)).toEqual(original[sibling]);
    await importBackup(page, original);
    expect(await bothProgress(page)).toEqual(saved);
  }
});

async function observeConstructors(page) {
  await page.addInitScript(() => {
    window.__combinedAudioContexts = 0;
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Original = window[key];
      if (Original) window[key] = new Proxy(Original, {construct(target, args) {
        window.__combinedAudioContexts++;
        return Reflect.construct(target, args);
      }});
    }
  });
}
async function completeInitialForm(page) {
  await foButton(page, 'select', 0).click();
  await foButton(page, 'select', 2).click();
  await foButton(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done['puzzle-1'])).toBe(1);
}

test('combined fresh Form completes without constructing native audio or requesting samples', async ({page}) => {
  const requests = [];
  await observeConstructors(page);
  page.on('request', request => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(request.url())) requests.push(request.url()); });
  await page.goto('/en.html');
  await page.locator('[data-go="form"]').click();
  await completeInitialForm(page);
  await page.selectOption('#themeSelect', '2');
  await openForm(page);
  expect(await page.evaluate(() => ({constructors: __combinedAudioContexts, context: ctx}))).toEqual({constructors: 0, context: null});
  expect(requests).toEqual([]);
});

test('native Conversation playback to Form route stops every active source/timer; completing Form starts no new audio', async ({page}) => {
  await observeAudio(page);
  await observeConstructors(page);
  const requests = [];
  page.on('request', request => { if (request.url().endsWith('.mp3')) requests.push(request.url()); });
  await page.goto('/en.html');
  await page.selectOption('#themeSelect', '2');
  await cvButton(page, 'call').click();
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(4);
  const ids = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start' && !__audioEvents.some(end => end.kind === 'ended' && end.id === e.id)).map(e => e.id));
  expect(ids.length).toBeGreaterThan(0);
  expect(requests).toHaveLength(5);
  // Exercise the registered destination hook directly: the ordinary visible
  // route goes through Home and would only prove Home's earlier cancellation.
  await page.evaluate(() => go('form'));
  await expect(foButton(page, 'mode')).toHaveCount(3);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.kind === 'stop' && e.id === id && e.scheduled === 0)), ids)).toBe(true);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.kind === 'ended' && e.id === id)), ids)).toBe(true);
  await completeInitialForm(page);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => ({sources: sources.length, timers: timers.length, starts: __audioEvents.filter(e => e.kind === 'start').length, contexts: __combinedAudioContexts, conversationBusy: cv.busy})))
    .toEqual({sources: 0, timers: 0, starts: 4, contexts: 1, conversationBusy: false});
  expect(requests).toHaveLength(5);
});

test('pending real Conversation samples cannot start stale playback after Form entry or assessment', async ({page}) => {
  await observeAudio(page);
  await observeConstructors(page);
  let release, requested = 0;
  const barrier = new Promise(resolve => { release = resolve; });
  await page.route('**/sounds/*.mp3', async route => {
    const response = await route.fetch(); requested++;
    await barrier;
    await route.fulfill({response});
  });
  try {
    await page.goto('/en.html');
    await page.selectOption('#themeSelect', '2');
    await cvButton(page, 'call').click();
    await expect.poll(() => requested).toBe(5);
    await page.evaluate(() => go('form'));
    await completeInitialForm(page);
    release();
    await expect.poll(() => page.evaluate(() => buffers?.length || 0)).toBe(5);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => ({route, sources: sources.length, timers: timers.length, starts: __audioEvents.filter(e => e.kind === 'start').length, contexts: __combinedAudioContexts, conversationBusy: cv.busy})))
      .toEqual({route: 'form', sources: 0, timers: 0, starts: 0, contexts: 1, conversationBusy: false});
    expect(requested).toBe(5);
  } finally { release(); }
});

test('combined school availability and independent levels preserve both histories across enabled/disabled editions', async ({page}) => {
  const base = 'http://127.0.0.1:8767/school-sites/';
  await seedBothThroughUI(page, 'en', base + 'combined/');
  await openForm(page);
  await foButton(page, 'level', 4).click();
  await foButton(page, 'mode', 'create').click();
  await foButton(page, 'save').click();
  await page.selectOption('#themeSelect', '2');
  await cvButton(page, 'level', 2).click();
  await cvButton(page, 'mode', 'create').click();
  expect(await page.evaluate(() => ({form: data.formPractice.level, conversation: data.conversationPractice.level}))).toEqual({form: 4, conversation: 2});
  const saved = await bothProgress(page);
  await page.reload();
  await page.locator('[data-nv="continue"]').click();
  await expect(cvButton(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await openForm(page);
  await expect(foButton(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
  for (const [edition, conversation, form] of [['conversation', true, false], ['form', false, true], ['updated', false, false], ['combined', true, true]]) {
    await page.goto(base + edition + '/en.html');
    expect(await bothProgress(page)).toEqual(saved);
    expect(await page.evaluate(() => ({conversation: scRouteAllowed('conversation'), form: scRouteAllowed('form')}))).toEqual({conversation, form});
    await openProgress(page);
    for (const button of await cvButton(page, 'open').all()) {
      if (conversation) await expect(button).toBeEnabled(); else await expect(button).toBeDisabled();
    }
    for (const button of await foButton(page, 'open').all()) {
      if (form) await expect(button).toBeEnabled(); else await expect(button).toBeDisabled();
    }
    await page.evaluate(() => go('conversation'));
    expect(await page.evaluate(() => route === 'conversation')).toBe(conversation);
    await page.evaluate(() => go('form'));
    expect(await page.evaluate(() => route === 'form')).toBe(form);
    expect(await bothProgress(page)).toEqual(saved);
  }
});

for (const version of [1, 2, 3]) test(`settings schema ${version} actual import/export and pupil preview preserve old consent and restrictions`, async ({page}) => {
  const legacy = structuredClone(v1Settings);
  legacy.schemaVersion = version;
  legacy.schoolName = 'Historical settings ' + version;
  if (version === 2) {
    legacy.themes = ['groove', 'conversation'];
    legacy.levels.conversation = [2, 4];
  }
  if (version === 3) {
    legacy.formEnabled = true;
    legacy.levels.form = [3];
  }
  await page.goto('http://127.0.0.1:8766/');
  await expect(page.locator('#schoolName')).toBeEnabled();
  await page.locator('#settingsFile').setInputFiles({name: 'historical-school.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(legacy))});
  await expect(page.locator('#message')).toContainText('importerte');
  await expect(page.locator('#schoolName')).toHaveValue(legacy.schoolName);
  const waiting = page.waitForEvent('download');
  await page.locator('#exportSettings').click();
  const current = JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
  expect(current.schemaVersion).toBe(6);
  expect(current.themes).toEqual(legacy.themes);
  expect(current.formEnabled).toBe(version === 3);
  for (const [id, levels] of Object.entries(legacy.levels)) expect(current.levels[id]).toEqual(levels);
  expect(current.levels.conversation).toEqual(version === 2 ? [2, 4] : [1, 2, 3, 4]);
  expect(current.levels.form).toEqual(version === 3 ? [3] : [1, 2, 3, 4]);
  expect(current.defaultLanguage).toBe(legacy.defaultLanguage);
  expect(current.colourPreset).toBe(legacy.colourPreset);
  await page.locator('#previewSchool').click();
  const preview = page.frameLocator('#pupilPreview');
  await expect(preview.locator('#schoolIdentity')).toHaveText(legacy.schoolName);
  expect(await preview.locator('body').evaluate(() => ({schema: schoolSettings.schemaVersion, themes: schoolSettings.themes, form: scRouteAllowed('form'), conversation: scRouteAllowed('conversation'), levels: schoolSettings.levels})))
    .toEqual({schema: 6, themes: legacy.themes, form: version === 3, conversation: version === 2, levels: current.levels});
  if (version === 2) {
    await preview.locator('#themeSelect').selectOption('2');
    await expect(preview.locator('[data-cv-action="level"]')).toHaveCount(2);
    await expect(preview.locator('[data-go="form"]')).toHaveCount(0);
  } else if (version === 3) {
    await preview.locator('[data-go="form"]').click();
    await expect(preview.locator('[data-fo-action="level"]')).toHaveCount(1);
    await expect(preview.locator('[data-fo-action="level"][data-fo-value="3"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(preview.locator('#themeSelect option')).toHaveCount(1);
  } else {
    expect(await preview.locator('body').evaluate(() => { go('conversation'); go('form'); return route; })).toBe('groove');
    await expect(preview.locator('[data-cv-action], [data-fo-action]')).toHaveCount(0);
  }
});
