const fs = require('node:fs');
const {test, expect, observeAudio} = require('./fixtures.cjs');

// Native Chromium viewport evidence only. Optional transport is observed, never
// substituted; visual completion is checked with no native audio construction.
const button = (page, action, value) => page.locator(`[data-wg="${action}"]${value === undefined ? '' : `[data-wg-value="${value}"]`}`);
async function openProgramme(page, locale = 'en') {
  await page.goto('/' + locale + '.html');
  await page.locator('[data-go="programme"]').click();
  await expect(button(page, 'task')).toHaveCount(3);
}
async function activate(locator, info) {
  if (info.project.use.hasTouch) await locator.tap(); else await locator.click();
}
async function watchNoAudio(page) {
  const samples = [];
  let constructions = 0;
  await page.exposeFunction('__programmeContextCreated', () => { constructions++; });
  page.on('request', request => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(request.url())) samples.push(request.url()); });
  await page.addInitScript(() => {
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const Native = window[key];
      if (Native) window[key] = new Proxy(Native, {construct(target, args) {
        void window.__programmeContextCreated();
        return Reflect.construct(target, args);
      }});
    }
  });
  return async () => {
    expect(constructions, 'Visual tasks must never construct native audio').toBe(0);
    expect(samples, 'Visual tasks must never request samples').toEqual([]);
    expect(await page.evaluate(() => ctx)).toBe(null);
  };
}
async function progress(page) {
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
}
async function exported(page) {
  const waiting = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function imported(page, data) {
  await page.locator('#importFile').setInputFiles({name: 'programme-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data))});
}
async function fillPulse(page, labels) {
  for (const [index, label] of labels.entries()) {
    await button(page, 'label', label).click();
    await button(page, 'place', index).click();
  }
}
async function nativeIds(page) {
  return page.evaluate(() => __audioEvents.filter(e => e.kind === 'start' && !__audioEvents.some(end => end.id === e.id && end.kind === 'ended')).map(e => e.id));
}
async function nativeStopped(page, ids, starts) {
  expect(ids.length).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.id === id && e.kind === 'stop' && e.scheduled === 0)), ids)).toBe(true);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e => e.id === id && e.kind === 'ended')), ids)).toBe(true);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => ({sources: sources.length, timers: timers.length, starts: __audioEvents.filter(e => e.kind === 'start').length})))
    .toEqual({sources: 0, timers: 0, starts});
}

for (const [locale, titles] of [
  ['nn', ['Pulsstien', 'Symbolmekanikaren', 'Rytmeverkstaden']],
  ['nb', ['Pulsstien', 'Symbolmekanikeren', 'Rytmeverkstedet']],
  ['en', ['Pulse trail', 'Symbol mechanic', 'Rhythm workshop']],
]) test(`week one ${locale}: three direct tasks, free configurations, keyboard/touch and remembered task`, async ({page}, info) => {
  const noAudio = await watchNoAudio(page);
  await openProgramme(page, locale);
  for (const task of ['pulse', 'symbol', 'create']) await expect(button(page, 'task', task)).toBeVisible();
  for (const [i, task] of ['create', 'symbol', 'pulse'].entries()) {
    await activate(button(page, 'task', task), info);
    await expect(page.locator('h1')).toHaveText(titles[['pulse', 'symbol', 'create'].indexOf(task)]);
    for (const level of [1, 2, 3, 4]) {
      await button(page, 'level', level).focus(); await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      await expect(button(page, 'level', level)).toHaveAttribute('aria-pressed', 'true');
      await expect(button(page, 'level', level)).toBeFocused();
      for (const entry of ['pulse', 'symbol', 'create']) await expect(button(page, 'task', entry)).toBeVisible();
    }
  }
  await button(page, 'task', 'create').click();
  await expect(button(page, 'save')).toBeEnabled();
  await expect(button(page, 'check')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.brand').click(); await page.locator('[data-nv="continue"]').click();
  await expect(button(page, 'task', 'create')).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
  await noAudio();
});

for (const level of [1, 2, 3]) test(`pulse configuration ${level}: all four curated grids count rests/holds chronologically without audio`, async ({page}) => {
  test.setTimeout(45000);
  const noAudio = await watchNoAudio(page);
  await openProgramme(page);
  await button(page, 'level', level).click();
  const labels = level === 3 ? ['1', '&', '2', '&', '3', '&', '4', '&'] : ['1', '2', '3', '4'];
  const ids = [];
  for (let round = 0; round < 4; round++) {
    ids.push(await page.locator('[data-wg-item]').getAttribute('data-wg-item'));
    await expect(button(page, 'place')).toHaveCount(labels.length);
    if (level === 2 && round === 0) {
      const descriptors = await page.locator('[data-wg-item] .wg-cell > small').allTextContents();
      expect(descriptors).toEqual(['New attack', 'Hold the note', 'Rest', 'New attack']);
    }
    await fillPulse(page, labels);
    await button(page, 'label', '1').click(); await button(page, 'place', 1).click();
    await button(page, 'check').click();
    await expect(page.locator('[data-wg-status]')).toContainText('Count every beat');
    await button(page, 'undo').click();
    await button(page, 'check').focus(); await page.keyboard.press('Enter');
    await expect(button(page, 'check')).toBeFocused();
    await expect(page.locator('[data-wg-status]')).toContainText('fits the brief');
    await button(page, 'check').click();
    expect(await page.evaluate(level => data.programmePractice.done['w1-pulse-' + level], level)).toBe(round + 1);
    if (round < 3) await button(page, 'next').click();
  }
  expect(new Set(ids).size).toBe(4);
  await noAudio();
});

for (const [level, correct, text] of [[1, 'quarter-rest', 'Quarter rest · 1 beat'], [2, 'half-rest', 'Half rest · 2 beats'], [3, 'eighth-rest', 'Eighth rest · ½ beat']]) {
  test(`symbol configuration ${level}: four contexts, actual SVG/text and silence predicate without audio`, async ({page}, info) => {
    const noAudio = await watchNoAudio(page);
    await openProgramme(page); await button(page, 'task', 'symbol').click();
    await button(page, 'level', level).click();
    const ids = [];
    for (let round = 0; round < 4; round++) {
      ids.push(await page.locator('[data-wg-item]').getAttribute('data-wg-item'));
      await expect(button(page, 'symbol')).toHaveCount(4);
      await expect(page.locator('[data-wg-span]')).toContainText('(0–4)');
      const timeline = await page.locator('[data-wg-onset]').evaluateAll(rows => rows.map(row => ({start: Number(row.dataset.wgOnset), duration: Number(row.dataset.wgDuration), text: row.textContent})));
      const restStart = [[0, 1, 2, 3], [0, 2, 0, 2], [0, 0.5, 2, 3.5]][level - 1][round];
      const gap = [1, 2, 0.5][level - 1];
      let elapsed = 0;
      for (const entry of timeline) { expect(entry.start).toBe(elapsed); expect(entry.duration).toBeGreaterThan(0); elapsed += entry.duration; }
      expect(elapsed).toBe(4);
      const rests = timeline.filter(entry => entry.text.includes('Rest'));
      expect(rests).toHaveLength(1); expect(rests[0]).toMatchObject({start: restStart, duration: gap});
      for (const entry of timeline.filter(entry => !entry.text.includes('Rest'))) expect(entry.text).toContain('C4');
      await expect(button(page, 'symbol', correct)).toContainText(text);
      for (const candidate of await button(page, 'symbol').all()) {
        await expect(candidate.locator('svg')).toHaveAttribute('viewBox', '0 0 64 64');
        await expect(candidate.locator('svg')).toHaveAttribute('aria-hidden', 'true');
        await expect(candidate.locator('svg')).toHaveAttribute('focusable', 'false');
        expect(await candidate.locator('svg').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(0);
      }
      await expect(button(page, 'symbol', 'half-rest').locator('rect')).toHaveAttribute('y', '26');
      await expect(button(page, 'symbol', 'half-rest').locator('rect')).toHaveAttribute('height', '8');
      await expect(button(page, 'symbol', 'quarter-note').locator('ellipse')).toHaveCount(1);
      await activate(button(page, 'symbol', 'quarter-note'), info);
      await expect(page.locator('[data-wg-status]')).toContainText('A note is not a rest');
      expect(await page.evaluate(level => data.programmePractice.done['w1-symbol-' + level] || 0, level)).toBe(round);
      await button(page, 'symbol', correct).focus(); await page.keyboard.press('Enter');
      await expect(button(page, 'symbol', correct)).toBeFocused();
      await expect(button(page, 'symbol', correct)).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-wg-status]')).toContainText('fits the brief');
      await button(page, 'symbol', correct).click();
      expect(await page.evaluate(level => data.programmePractice.done['w1-symbol-' + level], level)).toBe(round + 1);
      if (round < 3) await button(page, 'next').click();
    }
    expect(new Set(ids).size).toBe(4);
    await noAudio();
  });
}

test('configuration four exposes three distinct briefs in each direct task without forcing sound', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  await openProgramme(page); await button(page, 'level', 4).click();
  for (const task of ['pulse', 'symbol', 'create']) {
    await button(page, 'task', task).click();
    await expect(button(page, 'brief')).toHaveCount(3);
    for (const brief of [1, 2, 3]) {
      await button(page, 'brief', brief).click();
      await expect(button(page, 'brief', brief)).toHaveAttribute('aria-pressed', 'true');
      if (task === 'pulse') await expect(button(page, 'place')).toHaveCount(brief === 3 ? 8 : 4);
      if (task === 'symbol') {
        const span = await page.locator('[data-wg-span]').innerText();
        expect(span).toContain(String([1, 2, 0.5][brief - 1]));
      }
      if (task === 'create') await expect(button(page, 'cell')).toHaveCount(brief === 3 ? 8 : 4);
    }
  }
  await noAudio();
});

test('creative revision: before/current distinction, undo, silence, explicit save and no audio initialisation', async ({page}, info) => {
  const noAudio = await watchNoAudio(page);
  await openProgramme(page); await button(page, 'task', 'create').click();
  await expect(button(page, 'check')).toHaveCount(0);
  await button(page, 'snapshot').focus(); await page.keyboard.press('Space');
  await expect(button(page, 'snapshot')).toBeFocused();
  expect(await page.evaluate(() => wg.previous)).toEqual({division: 1, pattern: [1, 0, 1, 0]});
  await activate(button(page, 'cell', 0), info);
  await expect(button(page, 'cell', 0)).toHaveAttribute('aria-pressed', 'false');
  await button(page, 'undo').click();
  expect(await page.evaluate(() => wg.pattern)).toEqual([1, 0, 1, 0]);
  await button(page, 'cell', 0).click(); await button(page, 'cell', 2).click();
  expect(await page.evaluate(() => ({current: wg.pattern, before: wg.previous.pattern}))).toEqual({current: [0, 0, 0, 0], before: [1, 0, 1, 0]});
  await expect(page.locator('.wg-before')).toContainText('Before');
  await expect(page.locator('.wg-before .wg-cell')).toHaveCount(4);
  await button(page, 'play').click();
  await expect(page.locator('[data-wg-status]')).toContainText('entirely silent');
  await button(page, 'save').click(); await button(page, 'save').click();
  await expect(page.locator('[data-wg-status]')).toContainText('already saved');
  expect(await page.evaluate(() => data.programmePractice.creations)).toEqual([{
    slot: 'w1-create', challenge: 'rhythm-free.v1', revision: 1, level: 1, brief: 1, division: 1,
    pattern: [0, 0, 0, 0], previous: {division: 1, pattern: [1, 0, 1, 0]},
  }]);
  expect(await page.evaluate(() => data.programmePractice.done)).toEqual({});
  await noAudio();
});

test('saved programme work survives language/reload; older import preserves, invalid siblings and cancellation are atomic', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  let accept = true;
  page.on('dialog', dialog => accept ? dialog.accept() : dialog.dismiss());
  await openProgramme(page); await button(page, 'task', 'create').click();
  await button(page, 'level', 2).click();
  await button(page, 'snapshot').click();
  await button(page, 'cell', 0).click(); await button(page, 'cell', 1).click();
  await button(page, 'save').click();
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.programmePractice)));
  const other = await page.evaluate(() => JSON.stringify({form: data.formPractice, groove: data.groovePractice, theme: thStore}));
  await page.locator('.toolbar-menu summary').click(); await page.locator('[data-language="nb"]').click();
  expect(await page.evaluate(() => data.programmePractice)).toEqual(saved);
  await page.reload(); await page.locator('[data-nv="continue"]').click();
  await expect(button(page, 'task', 'create')).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await button(page, 'open', 0).click();
  expect(await page.evaluate(() => ({current: wg.pattern, previous: wg.previous}))).toEqual({current: saved.creations[0].pattern, previous: saved.creations[0].previous});
  await progress(page); const backup = await exported(page);
  expect(backup.programmePractice).toEqual(saved);
  const older = structuredClone(backup); delete older.programmePractice;
  await imported(page, older); await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  expect(await page.evaluate(() => data.programmePractice)).toEqual(saved);
  for (const corrupt of [
    value => { value.programmePractice.creations[0].pattern[0] = 2; },
    value => { value.programmePractice.creations[0].revision = 2; },
    value => { value.programmePractice.creations[0].previous.pattern.pop(); },
    value => { value.formPractice.version = 99; value.programmePractice.creations = []; },
  ]) {
    const bad = structuredClone(backup); corrupt(bad);
    const before = await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}));
    await imported(page, bad); await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(() => JSON.stringify({data, theme: thStore, stored: localStorage.getItem('musikkverkstad-v1')}))).toBe(before);
  }
  const replacement = structuredClone(backup); replacement.programmePractice.creations = [];
  accept = false;
  await imported(page, replacement); await expect(page.locator('#importFile')).toHaveValue('');
  expect(await page.evaluate(() => data.programmePractice)).toEqual(saved);
  accept = true;
  await imported(page, replacement); expect(await page.evaluate(() => data.programmePractice.creations)).toEqual([]);
  await imported(page, backup); expect(await page.evaluate(() => data.programmePractice)).toEqual(saved);
  expect(await page.evaluate(() => JSON.stringify({form: data.formPractice, groove: data.groovePractice, theme: thStore}))).toBe(other);
  await noAudio();
});

for (const fault of ['quota', 'denied']) test(`programme ${fault} storage retains temporary work in an actual downloadable backup`, async ({page}) => {
  const noAudio = await watchNoAudio(page);
  await page.addInitScript(mode => {
    if (mode === 'quota') Storage.prototype.setItem = function () { throw new DOMException('Injected quota', 'QuotaExceededError'); };
    else Object.defineProperty(window, 'localStorage', {get() { throw new DOMException('Injected denial', 'SecurityError'); }});
  }, fault);
  await openProgramme(page); await button(page, 'task', 'create').click();
  await button(page, 'snapshot').click(); await button(page, 'cell', 1).click(); await button(page, 'save').click();
  expect(await page.evaluate(() => data.programmePractice.creations.length)).toBe(1);
  await expect(page.locator('.wg-stage')).toContainText('Export before closing');
  await progress(page); const backup = await exported(page);
  expect(backup.programmePractice.creations[0].pattern).toEqual([1, 1, 1, 0]);
  await noAudio();
});

test('damaged storage remains protected while programme practice is recoverable by explicit validated import', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  await page.addInitScript(() => localStorage.setItem('musikkverkstad-v1', '{damaged'));
  await openProgramme(page); await button(page, 'task', 'create').click(); await button(page, 'save').click();
  expect(await page.evaluate(() => localStorage.getItem('musikkverkstad-v1'))).toBe('{damaged');
  await progress(page); const backup = await exported(page);
  page.on('dialog', dialog => dialog.accept()); await imported(page, backup);
  await expect.poll(() => page.evaluate(() => storageOK)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('musikkverkstad-v1')).programmePractice)).toEqual(backup.programmePractice);
  await noAudio();
});

test('final undo recovers keyboard focus when its control becomes disabled', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  await openProgramme(page); await button(page, 'task', 'create').click();
  await button(page, 'cell', 0).click();
  await button(page, 'undo').focus(); await page.keyboard.press('Enter');
  await expect(button(page, 'undo')).toBeDisabled();
  await expect(button(page, 'cell', 0)).toBeFocused();
  expect(await page.evaluate(() => wg.pattern)).toEqual([1, 0, 1, 0]);
  await noAudio();
});

test('configuration four saved eighth-grid brief reopens exactly after another brief was chosen', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  await openProgramme(page); await button(page, 'task', 'create').click();
  await button(page, 'level', 4).click(); await button(page, 'brief', 3).click();
  await button(page, 'cell', 0).click(); await button(page, 'snapshot').click(); await button(page, 'cell', 7).click();
  await button(page, 'save').click();
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.programmePractice.creations[0])));
  expect(saved).toMatchObject({level: 4, brief: 3, division: 2, pattern: [1, 0, 0, 0, 0, 0, 0, 1], previous: {division: 2, pattern: [1, 0, 0, 0, 0, 0, 0, 0]}});
  await button(page, 'brief', 1).click(); await expect(button(page, 'cell')).toHaveCount(4);
  await button(page, 'open', 0).click();
  await expect(button(page, 'brief', 3)).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'cell')).toHaveCount(8);
  expect(await page.evaluate(() => ({division: wg.division, pattern: wg.pattern, previous: wg.previous}))).toEqual({division: saved.division, pattern: saved.pattern, previous: saved.previous});
  await noAudio();
});

test('native piano keeps sustain/rest chronology, Stop and navigation cancel every scheduled source', async ({page}) => {
  await observeAudio(page);
  const requests = [];
  page.on('response', response => { if (response.url().endsWith('.mp3')) requests.push(response.status()); });
  await openProgramme(page); await button(page, 'level', 2).click();
  await button(page, 'play').focus(); await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(2);
  const starts = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start'));
  expect(requests).toEqual([200, 200, 200, 200, 200]);
  expect(starts[1].scheduled - starts[0].scheduled).toBeCloseTo(3 * 60 / 90, 5);
  for (const source of starts) { expect(source.frames).toBeGreaterThan(1000); expect(source.rate).toBe(1); }
  const scheduledDurations = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').map(start => __audioEvents.find(e => e.kind === 'stop' && e.id === start.id).scheduled - start.scheduled));
  expect(scheduledDurations[0]).toBeCloseTo(2 * 60 / 90 * 0.86 + 0.04, 5);
  expect(scheduledDurations[1]).toBeCloseTo(60 / 90 * 0.86 + 0.04, 5);
  const ids = await nativeIds(page);
  await button(page, 'stop').focus(); await page.keyboard.press('Enter');
  await nativeStopped(page, ids, 2);
  await button(page, 'play').click();
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(4);
  const more = await nativeIds(page);
  await page.locator('.brand').click();
  await nativeStopped(page, more, 4);
  await page.locator('[data-nv="continue"]').click();
  await expect(button(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'task', 'pulse')).toHaveAttribute('aria-pressed', 'true');
});

test('native creative before-version and current have distinct scheduled onsets', async ({page}) => {
  await observeAudio(page);
  await openProgramme(page); await button(page, 'task', 'create').click(); await button(page, 'snapshot').click();
  await button(page, 'cell', 0).click(); await button(page, 'cell', 1).click();
  await button(page, 'before').click();
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(2);
  const before = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start'));
  expect(before[1].scheduled - before[0].scheduled).toBeCloseTo(2 * 60 / 90, 5);
  await button(page, 'stop').click();
  await button(page, 'play').click();
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(4);
  const current = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').slice(2));
  expect(current[1].scheduled - current[0].scheduled).toBeCloseTo(60 / 90, 5);
  const ids = await nativeIds(page); await button(page, 'stop').click(); await nativeStopped(page, ids, 4);
});

for (const cancel of ['stop', 'navigate']) test(`late real sample loading: programme ${cancel} prevents queued notes and stale callbacks`, async ({page}) => {
  await observeAudio(page);
  let release, requested = 0;
  const barrier = new Promise(resolve => { release = resolve; });
  await page.route('**/sounds/*.mp3', async route => {
    const response = await route.fetch(); requested++;
    await barrier; await route.fulfill({response});
  });
  try {
    await openProgramme(page); await button(page, 'play').click();
    await expect.poll(() => requested).toBe(5);
    if (cancel === 'stop') await button(page, 'stop').click(); else await page.locator('.brand').click();
    release(); await expect.poll(() => page.evaluate(() => buffers?.length || 0)).toBe(5);
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => ({starts: __audioEvents.filter(e => e.kind === 'start').length, busy: wg.busy, sources: sources.length, timers: timers.length})))
      .toEqual({starts: 0, busy: false, sources: 0, timers: 0});
    if (cancel === 'stop') await expect(button(page, 'play')).toBeEnabled(); else await expect(page.locator('[data-nv="continue"]')).toBeVisible();
  } finally { release(); }
});

test('sample failure gives visible recovery and leaves visual pulse completion available', async ({page}) => {
  await observeAudio(page);
  await page.route('**/sounds/*.mp3', route => route.fulfill({status: 503, body: 'Injected test fault'}));
  await openProgramme(page); await button(page, 'play').click();
  await expect(page.locator('[data-wg-status]')).toContainText('Could not start audio');
  expect(await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(0);
  await fillPulse(page, ['1', '2', '3', '4']); await button(page, 'check').click();
  expect(await page.evaluate(() => data.programmePractice.done['w1-pulse-1'])).toBe(1);
  await page.unroute('**/sounds/*.mp3'); await button(page, 'play').click();
  await expect.poll(() => page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(2);
  const ids = await nativeIds(page); await button(page, 'stop').click(); await nativeStopped(page, ids, 2);
});

test('configured programme levels guard entry, Continue and reopening without deleting disabled history', async ({page}) => {
  const noAudio = await watchNoAudio(page);
  page.on('dialog', dialog => dialog.accept());
  const base = 'http://127.0.0.1:8767/school-sites/';
  await page.goto(base + 'programme/en.html'); await page.locator('[data-go="programme"]').click();
  await expect(button(page, 'level')).toHaveCount(2); await expect(button(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'level', 1)).toHaveCount(0);
  await button(page, 'task', 'create').click(); await button(page, 'snapshot').click(); await button(page, 'save').click();
  await progress(page); const backup = await exported(page);
  expect(backup.programmePractice.creations[0].level).toBe(2);
  await page.goto(base + 'programme-disabled/en.html');
  await expect(page.locator('[data-go="programme"]')).toHaveCount(0);
  await expect(page.locator('[data-nv="continue"]')).toHaveCount(0);
  await progress(page); await imported(page, backup);
  expect(await page.evaluate(() => data.programmePractice)).toEqual(backup.programmePractice);
  await expect(button(page, 'open', 0)).toBeDisabled();
  await page.evaluate(() => go('programme'));
  expect(await page.evaluate(() => route)).not.toBe('programme');
  await expect(button(page, 'task')).toHaveCount(0);
  await noAudio();
});
