const fs = require('node:fs');
const {test, expect} = require('./fixtures.cjs');

// Real rendered Chromium tests. The mobile project uses touch input; neither
// viewport profile establishes physical-device or screen-reader usability.
const control = (page, action, value) => page.locator(`[data-fo-action="${action}"]${value === undefined ? '' : `[data-fo-value="${value}"]`}`);
async function openForm(page, locale = 'en') {
  await page.goto('/' + locale + '.html');
  await page.locator('[data-go="form"]').click();
  await expect(control(page, 'mode')).toHaveCount(3);
}
async function activate(locator, testInfo) {
  if (testInfo.project.use.hasTouch) await locator.tap();
  else await locator.click();
}
async function readGuide(page, expected) {
  const guide = page.locator('.fo-stage details');
  await expect(guide).not.toHaveAttribute('open', '');
  await guide.locator('summary').click();
  await expect(page.locator('.fo-short')).toBeVisible();
  await expect(page.locator('.fo-short')).toContainText(expected);
  await expect(guide).toContainText('C4–A4');
  await guide.locator('summary').click();
}
async function fillMap(page, map) {
  for (const [slot, card] of map.entries()) {
    await control(page, 'slot', slot).click();
    await control(page, 'place', card).click();
  }
}
async function monitorNoAudio(page) {
  const samples = [];
  let contexts = 0;
  await page.exposeFunction('__reportFormAudio', () => { contexts++; });
  page.on('request', request => { if (/\/sounds\/|\.mp3(?:$|\?)/.test(request.url())) samples.push(request.url()); });
  await page.addInitScript(() => {
    window.__formAudioContexts = 0;
    for (const key of ['AudioContext', 'webkitAudioContext']) {
      const NativeContext = window[key];
      if (NativeContext) window[key] = new Proxy(NativeContext, {
        construct(target, args) { window.__formAudioContexts++; void window.__reportFormAudio(); return Reflect.construct(target, args); },
      });
    }
  });
  return async () => {
    expect(samples, 'Visual Form must not request piano samples').toEqual([]);
    expect(contexts, 'No native AudioContext across navigations').toBe(0);
    expect(await page.evaluate(() => window.__formAudioContexts), 'No native AudioContext was constructed').toBe(0);
    expect(await page.evaluate(() => ctx), 'The shared audio engine remains uninitialised').toBe(null);
  };
}
async function progressPage(page) {
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
}
async function exportProgress(page) {
  const waiting = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function importProgress(page, data) {
  await page.locator('#importFile').setInputFiles({name: 'form-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data))});
}
const sets = {
  repeat: [['A', 'A'], ['B', 'B']],
  contrast: [['A', 'B'], ['B', 'A']],
  return: [['A', 'B', 'A'], ['B', 'A', 'B']],
  variation: [['A', 'Av'], ['B', 'Bv']],
};
const shortMaps = {repeat: 'A–A → B–B', contrast: 'A–B → B–A', return: 'A–B–A → B–A–B', variation: 'A–A′ → B–B′'};
const matchesBrief = (map, brief) => sets[brief].some(valid => JSON.stringify(valid) === JSON.stringify(map));
const allMaps = (palette, length) => length ? allMaps(palette, length - 1).flatMap(prefix => palette.map(card => [...prefix, card])) : [[]];

for (const [locale, title] of [['nn', 'Formverkstad'], ['nb', 'Formverksted'], ['en', 'Form Workshop']]) {
  test(`Form ${locale}: direct entrances, four free configurations, keyboard/touch and Continue without audio`, async ({page}, testInfo) => {
    const noAudio = await monitorNoAudio(page);
    await openForm(page, locale);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('#themeSelect option')).toHaveCount(2);
    // No scroll or forced interaction: the first musical card must already
    // intersect the initial desktop/mobile viewport in every locale.
    await expect(page.locator('.fo-candidate [data-fo-section]').first()).toBeInViewport();
    await readGuide(page, shortMaps.repeat);
    for (const level of [1, 2, 3, 4]) {
      await activate(control(page, 'level', level), testInfo);
      await expect(control(page, 'level', level)).toHaveAttribute('aria-pressed', 'true');
      for (const mode of ['puzzle', 'build', 'create']) {
        await control(page, 'mode', mode).focus();
        await page.keyboard.press(mode === 'build' ? 'Space' : 'Enter');
        await expect(control(page, 'mode', mode)).toHaveAttribute('aria-pressed', 'true');
        for (const entrance of ['puzzle', 'build', 'create']) await expect(control(page, 'mode', entrance)).toBeVisible();
      }
    }
    await expect(control(page, 'check')).toHaveCount(0);
    await expect(control(page, 'place')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.brand').click();
    await page.locator('[data-nv="continue"]').click();
    await expect(control(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
    await expect(control(page, 'mode', 'create')).toHaveAttribute('aria-pressed', 'true');
    await noAudio();
  });
}

for (const [level, brief] of [[1, 'repeat'], [1, 'contrast'], [2, 'return'], [3, 'variation'], [4, 'return']]) {
  test(`Form puzzle ${level}/${brief}: all and only valid maps, permutation and single practice credit without audio`, async ({page}, testInfo) => {
    const noAudio = await monitorNoAudio(page);
    await openForm(page);
    await control(page, 'level', level).click();
    if ([1, 4].includes(level)) await control(page, 'brief', brief).click();
    await readGuide(page, shortMaps[brief]);
    const options = await page.locator('.fo-candidate').evaluateAll(articles => articles.map(article =>
      [...article.querySelectorAll('[data-fo-section]')].map(card => card.dataset.foSection)));
    expect(options).toHaveLength(3);
    const correct = options.flatMap((map, index) => matchesBrief(map, brief) ? [index] : []);
    expect(correct).toHaveLength(2);
    await activate(control(page, 'select', correct[0]), testInfo);
    await control(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('Compare every selected and unselected');
    expect(await page.evaluate(level => data.formPractice.done['puzzle-' + level] || 0, level)).toBe(0);
    await activate(control(page, 'select', correct[1]), testInfo);
    await control(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('not mastery');
    await control(page, 'check').click();
    expect(await page.evaluate(level => data.formPractice.done['puzzle-' + level], level)).toBe(1);
    const before = options.map(map => map.join(','));
    await control(page, 'new').click();
    const after = await page.locator('.fo-candidate').evaluateAll(articles => articles.map(article =>
      [...article.querySelectorAll('[data-fo-section]')].map(card => card.dataset.foSection).join(',')));
    expect(after).not.toEqual(before);
    expect([...after].sort()).toEqual([...before].sort());
    await page.reload();
    expect(await page.evaluate(level => data.formPractice.done['puzzle-' + level], level)).toBe(1);
    await noAudio();
  });
}

for (const [level, brief] of [[1, 'repeat'], [1, 'contrast'], [2, 'return'], [3, 'variation'], [4, 'return']]) {
  test(`Form build ${level}/${brief}: independent complete accepted set, replacement and no automatic slot advance`, async ({page}) => {
    test.setTimeout(45000);
    const noAudio = await monitorNoAudio(page);
    await openForm(page);
    await control(page, 'level', level).click();
    if ([1, 4].includes(level)) await control(page, 'brief', brief).click();
    await control(page, 'mode', 'build').click();
    await control(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('Fill every slot');
    const palette = brief === 'variation' ? ['A', 'Av', 'B', 'Bv'] : ['A', 'B'];
    await expect(control(page, 'place')).toHaveCount(palette.length);
    let accepted = 0;
    for (const map of allMaps(palette, brief === 'return' ? 3 : 2)) {
      await fillMap(page, map);
      await expect(control(page, 'slot', map.length - 1)).toHaveAttribute('aria-pressed', 'true');
      expect(await page.locator('[data-fo-current] [data-fo-section]').evaluateAll(cards => cards.map(card => card.dataset.foSection))).toEqual(map);
      await control(page, 'check').click();
      if (matchesBrief(map, brief)) {
        accepted++;
        await expect(page.locator('.feedback')).toContainText('The map meets the brief');
      } else await expect(page.locator('.feedback')).not.toContainText('The map meets the brief');
    }
    expect(accepted).toBe(2);
    expect(await page.evaluate(level => data.formPractice.done['build-' + level], level)).toBe(1);
    await control(page, 'slot', 0).click();
    await control(page, 'clear').click();
    await expect(page.locator('[data-fo-current] .fo-empty')).toHaveCount(1);
    await control(page, 'undo').click();
    await expect(page.locator('[data-fo-current] .fo-empty')).toHaveCount(0);
    await noAudio();
  });
}

for (const locale of ['nn', 'nb', 'en']) {
  test(`Form ${locale}: real SVG coordinates, shared pitch scale, beat/text equivalents and monochrome hidden-SVG completion`, async ({page}) => {
    const noAudio = await monitorNoAudio(page);
    await openForm(page, locale);
    await control(page, 'mode', 'create').click();
    const palette = page.locator('.fo-palette');
    const canonical = {A: [60, 62, 64, 67], Av: [60, 62, 64, 69], B: [67, 64, 62, 60], Bv: [67, 64, 62, 62]};
    const pitchName = {60: 'C4', 62: 'D4', 64: 'E4', 67: 'G4', 69: 'A4'};
    const y = {60: 76, 62: 64, 64: 52, 67: 34, 69: 22};
    for (const [id, pitches] of Object.entries(canonical)) {
      const card = palette.locator(`[data-fo-section="${id}"]`);
      await expect(card.locator('svg')).toHaveAttribute('aria-hidden', 'true');
      await expect(card.locator('svg')).toHaveAttribute('focusable', 'false');
      await expect(card.locator('svg')).toHaveAttribute('viewBox', '0 0 160 105');
      const circles = await card.locator('circle').evaluateAll(nodes => nodes.map(node => ({pitch: Number(node.dataset.pitch), beat: Number(node.dataset.beat), x: Number(node.getAttribute('cx')), y: Number(node.getAttribute('cy'))})));
      expect(circles).toEqual(pitches.map((pitch, i) => ({pitch, beat: i + 1, x: 20 + 40 * i, y: y[pitch]})));
      await expect(card.locator('polyline')).toHaveAttribute('points', pitches.map((pitch, i) => `${20 + i * 40},${y[pitch]}`).join(' '));
      const text = await card.locator('.fo-notes').innerText();
      for (const [i, pitch] of pitches.entries()) expect(text).toContain(`${i + 1}: ${pitchName[pitch]}`);
      if (id.endsWith('v')) await expect(card.locator('circle').last()).toHaveAttribute('stroke-dasharray', '2 2');
      expect(await card.locator('svg').evaluate(svg => svg.getBoundingClientRect().height)).toBeGreaterThan(0);
    }
    expect(await palette.locator('.fo-family-a').first().evaluate(card => getComputedStyle(card).borderTopStyle)).toBe('solid');
    expect(await palette.locator('.fo-family-b').first().evaluate(card => getComputedStyle(card).borderTopStyle)).toBe('dashed');
    await expect(page.locator('.fo-card button')).toHaveCount(0);
    await expect(page.locator('.fo-candidate button button')).toHaveCount(0);
    await control(page, 'level', 3).click();
    await control(page, 'mode', 'build').click();
    await page.addStyleTag({content: '.fo-stage *{color:black!important;background:white!important;border-color:black!important}.fo-stage svg{display:none!important}'});
    await expect(page.locator('.fo-palette [data-fo-section="Av"] .fo-notes')).toBeVisible();
    await fillMap(page, ['A', 'Av']);
    await control(page, 'check').click();
    expect(await page.evaluate(() => data.formPractice.done['build-3'])).toBe(1);
    await control(page, 'hint').click();
    await expect(page.locator('.fo-model [data-fo-section="X"]')).toHaveCount(1);
    await expect(page.locator('.fo-model [data-fo-section="Xv"]')).toHaveCount(1);
    await expect(page.locator('.fo-model button')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await noAudio();
  });
}

test('Form creation: touch/keyboard selection, before-version, moves, undo, length bounds and focus recovery', async ({page}, testInfo) => {
  const noAudio = await monitorNoAudio(page);
  await openForm(page);
  await activate(control(page, 'mode', 'create'), testInfo);
  await expect(control(page, 'check')).toHaveCount(0);
  await expect(control(page, 'place')).toHaveCount(4);
  expect(await page.evaluate(() => fo.creation)).toEqual(['A', 'B', 'A']);
  await control(page, 'snapshot').click();
  await expect(page.locator('[data-fo-before] [data-fo-section]')).toHaveCount(3);
  await control(page, 'slot', 2).focus(); await page.keyboard.press('Space');
  await control(page, 'place', 'Av').focus(); await page.keyboard.press('Enter');
  await expect(control(page, 'slot', 2)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => ({map: fo.creation, before: fo.previous}))).toEqual({map: ['A', 'B', 'Av'], before: ['A', 'B', 'A']});
  await control(page, 'left').click();
  expect(await page.evaluate(() => fo.creation)).toEqual(['A', 'Av', 'B']);
  await control(page, 'undo').click();
  expect(await page.evaluate(() => fo.creation)).toEqual(['A', 'B', 'Av']);
  await control(page, 'undo').focus(); await page.keyboard.press('Enter');
  expect(await page.evaluate(() => fo.creation)).toEqual(['A', 'B', 'A']);
  await expect(control(page, 'slot', 2)).toBeFocused();
  await expect(control(page, 'undo')).toBeDisabled();
  await activate(control(page, 'place', 'Av'), testInfo);
  await control(page, 'save').click();
  expect(await page.evaluate(() => data.formPractice.creations[0])).toEqual({level: 1, map: ['A', 'B', 'Av'], previous: ['A', 'B', 'A']});
  await control(page, 'snapshot').click();
  await expect(page.locator('.feedback')).toContainText('previous comparison version was replaced');
  expect(await page.evaluate(() => fo.previous)).toEqual(['A', 'B', 'Av']);
  for (let i = 0; i < 3; i++) await activate(control(page, 'add'), testInfo);
  await expect(page.locator('[data-fo-current] > .fo-map > li')).toHaveCount(6);
  await expect(control(page, 'add')).toBeDisabled();
  const numbers = await page.locator('[data-fo-current] .fo-slot-number').allTextContents();
  expect(numbers).toEqual(['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6']);
  await control(page, 'slot', 5).click();
  await control(page, 'remove').click();
  await control(page, 'undo').click();
  expect(await page.evaluate(() => ({length: fo.creation.length, selected: fo.selected}))).toEqual({length: 6, selected: 5});
  for (let i = 0; i < 4; i++) await control(page, 'remove').click();
  await expect(control(page, 'remove')).toBeDisabled();
  await expect(control(page, 'slot', 1)).toBeFocused();
  await expect(page.locator('[data-fo-current] > .fo-map > li')).toHaveCount(2);
  await control(page, 'undo').click();
  await expect(page.locator('[data-fo-current] > .fo-map > li')).toHaveCount(3);
  const draft = await page.evaluate(() => ({map: fo.creation.slice(), previous: fo.previous.slice()}));
  await control(page, 'mode', 'puzzle').click();
  await control(page, 'level', 4).click();
  await control(page, 'brief', 'return').click();
  await control(page, 'brief', 'contrast').click();
  await control(page, 'mode', 'create').click();
  expect(await page.evaluate(() => ({map: fo.creation, previous: fo.previous}))).toEqual(draft);
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await noAudio();
});

test('Form configuration 4 changes objective brief and slot count without counting the old success', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  await openForm(page);
  await control(page, 'level', 4).click();
  await control(page, 'mode', 'build').click();
  await control(page, 'brief', 'contrast').click();
  await fillMap(page, ['A', 'B']);
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'build-4': 1});
  await control(page, 'brief', 'return').click();
  await expect(control(page, 'slot')).toHaveCount(3);
  await expect(page.locator('[data-fo-current] .fo-empty')).toHaveCount(3);
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'build-4': 1});
  await fillMap(page, ['B', 'A', 'B']);
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'build-4': 2});
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'build-4': 2});
  await noAudio();
});

test('Form saved maps survive language, reload and real backups; invalid/old/replacement imports stay atomic', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  page.on('dialog', dialog => dialog.accept());
  await openForm(page);
  await control(page, 'mode', 'create').click();
  await control(page, 'snapshot').click();
  await control(page, 'slot', 2).click();
  await control(page, 'place', 'Av').click();
  await control(page, 'save').click();
  await control(page, 'save').click();
  await expect(page.locator('.feedback')).toContainText('already saved');
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.formPractice)));
  expect(saved.creations).toHaveLength(1);
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-language="nb"]').click();
  expect(await page.evaluate(() => data.formPractice)).toEqual(saved);
  await page.reload();
  expect(await page.evaluate(() => data.formPractice)).toEqual(saved);
  await page.locator('[data-nv="continue"]').click();
  await control(page, 'open', 0).click();
  expect(await page.evaluate(() => ({map: fo.creation, previous: fo.previous}))).toEqual({map: saved.creations[0].map, previous: saved.creations[0].previous});
  await progressPage(page);
  const backup = await exportProgress(page);
  expect(backup.formPractice).toEqual(saved);
  const existing = await page.evaluate(() => JSON.stringify({data, theme: thStore}));
  for (const corrupt of [
    value => { value.formPractice.version = 99; },
    value => { value.formPractice.creations[0].map[0] = 'X'; },
    value => { value.formPractice.creations[0].previous = ['A']; },
    value => { value.formPractice.done['create-1'] = 1; },
  ]) {
    const invalid = structuredClone(backup); corrupt(invalid);
    await importProgress(page, invalid);
    await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
    expect(await page.evaluate(() => JSON.stringify({data, theme: thStore}))).toBe(existing);
  }
  const older = structuredClone(backup); delete older.formPractice;
  await importProgress(page, older);
  await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  expect(await page.evaluate(() => data.formPractice)).toEqual(saved);
  const replacement = structuredClone(backup); replacement.formPractice.creations = [];
  await importProgress(page, replacement);
  expect(await page.evaluate(() => data.formPractice.creations)).toEqual([]);
  await importProgress(page, backup);
  expect(await page.evaluate(() => data.formPractice)).toEqual(saved);
  await noAudio();
});

for (const fault of ['quota', 'denied']) test(`Form ${fault}: in-memory saved work and actual downloadable recovery without audio`, async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  await page.addInitScript(mode => {
    if (mode === 'quota') Storage.prototype.setItem = function () { throw new DOMException('Injected quota', 'QuotaExceededError'); };
    else Object.defineProperty(window, 'localStorage', {get() { throw new DOMException('Injected denial', 'SecurityError'); }});
  }, fault);
  await openForm(page);
  await control(page, 'mode', 'create').click();
  await control(page, 'save').click();
  await expect(page.locator('.fo-stage')).toContainText('Export before closing');
  expect(await page.evaluate(() => data.formPractice.creations.length)).toBe(1);
  await progressPage(page);
  const backup = await exportProgress(page);
  expect(backup.formPractice.creations[0]).toEqual({level: 1, map: ['A', 'B', 'A'], previous: null});
  await noAudio();
});

test('Form corrupt storage is preserved until explicit validated backup recovery', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  await page.addInitScript(() => localStorage.setItem('musikkverkstad-v1', '{corrupted'));
  await openForm(page);
  await control(page, 'mode', 'create').click();
  await control(page, 'save').click();
  expect(await page.evaluate(() => localStorage.getItem('musikkverkstad-v1'))).toBe('{corrupted');
  await progressPage(page);
  const backup = await exportProgress(page);
  expect(backup.formPractice.creations).toHaveLength(1);
  page.on('dialog', dialog => dialog.accept());
  await importProgress(page, backup);
  await expect.poll(() => page.evaluate(() => storageOK)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('musikkverkstad-v1')).formPractice)).toEqual(backup.formPractice);
  await noAudio();
});

test('Form objective modes have independent round credit and mode toggling cannot duplicate it', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  await openForm(page);
  for (const index of [0, 2]) await control(page, 'select', index).click();
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'puzzle-1': 1});
  await control(page, 'mode', 'build').click();
  await fillMap(page, ['B', 'B']);
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'puzzle-1': 1, 'build-1': 1});
  for (const mode of ['puzzle', 'build', 'puzzle']) {
    await control(page, 'mode', mode).click();
    await control(page, 'check').click();
  }
  expect(await page.evaluate(() => data.formPractice.done)).toEqual({'puzzle-1': 1, 'build-1': 1});
  await noAudio();
});

test('Form school restrictions preserve saved maps while disabling home, Continue, direct route and reopening', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  page.on('dialog', dialog => dialog.accept());
  const base = 'http://127.0.0.1:8767/school-sites/';
  await page.goto(base + 'form/en.html');
  await page.locator('[data-go="form"]').click();
  await expect(control(page, 'level')).toHaveCount(2);
  await expect(control(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await expect(control(page, 'level', 1)).toHaveCount(0);
  await control(page, 'mode', 'create').click();
  await control(page, 'save').click();
  await progressPage(page);
  const backup = await exportProgress(page);
  expect(backup.formPractice.creations[0].level).toBe(2);
  await page.goto(base + 'updated/en.html');
  await expect(page.locator('[data-go="form"]')).toHaveCount(0);
  await expect(page.locator('[data-nv="continue"]')).toHaveCount(0);
  await progressPage(page);
  await importProgress(page, backup);
  expect(await page.evaluate(() => data.formPractice)).toEqual(backup.formPractice);
  await expect(control(page, 'open', 0)).toBeDisabled();
  await page.evaluate(() => go('form'));
  expect(await page.evaluate(() => route)).toBe('groove');
  await expect(control(page, 'mode')).toHaveCount(0);
  await page.locator('.brand').click();
  await page.locator('[data-nv="start"]').click();
  expect(await page.evaluate(() => route)).toBe('groove');
  expect(await page.evaluate(() => data.formPractice)).toEqual(backup.formPractice);
  await noAudio();
});

test('Form restricted configuration 3 recommends a feasible variation route and keeps all entrances', async ({page}) => {
  const noAudio = await monitorNoAudio(page);
  await page.goto('http://127.0.0.1:8767/school-sites/form-level3/en.html');
  await page.locator('[data-go="form"]').click();
  await expect(control(page, 'level')).toHaveCount(1);
  await expect(control(page, 'level', 3)).toHaveAttribute('aria-pressed', 'true');
  await readGuide(page, 'A–A′ → B–B′');
  await expect(page.locator('.fo-short')).not.toContainText('A–B–A');
  for (const mode of ['puzzle', 'build', 'create']) await expect(control(page, 'mode', mode)).toBeVisible();
  await control(page, 'mode', 'build').click();
  await fillMap(page, ['B', 'Bv']);
  await control(page, 'check').click();
  expect(await page.evaluate(() => data.formPractice.done['build-3'])).toBe(1);
  await noAudio();
});
