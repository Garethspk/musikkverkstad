const fs = require('node:fs');
const {test, expect, observeAudio} = require('./fixtures.cjs');

// All cases run under both configured Chromium viewport projects. These are
// native browser/control/decoded-sample checks, never physical-speaker evidence.
const cvControl = (page, action, value) => page.locator(`[data-cv-action="${action}"]${value === undefined ? '' : `[data-cv-value="${value}"]`}`);
async function openConversation(page, locale = 'en') {
  await page.goto('/' + locale + '.html');
  await page.selectOption('#themeSelect', '2');
  await expect(cvControl(page, 'mode')).toHaveCount(3);
}
async function nativeObservation(page) {
  await observeAudio(page);
  await page.addInitScript(() => {
    window.__cvNotes = [];
    window.__cvNativeSources = [];
    const original = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      const result = original.apply(this, args);
      const sample = buffers.find(item => item.buffer === this.buffer);
      window.__cvNativeSources.push({buffer: this.buffer, rate: this.playbackRate.value});
      window.__cvNotes.push({midi: sample ? sample.m + 12 * Math.log2(this.playbackRate.value) : null,
        start: args[0], duration: this.buffer.duration, frames: this.buffer.length});
      return result;
    };
  });
}
async function playingIds(page) {
  return page.evaluate(() => __audioEvents.filter(e => e.kind === 'start' &&
    !__audioEvents.some(end => end.kind === 'ended' && end.id === e.id)).map(e => e.id));
}
async function assertStopped(page, ids, starts) {
  expect(ids.length).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e =>
    e.id === id && e.kind === 'stop' && e.scheduled === 0)), ids)).toBe(true);
  await expect.poll(() => page.evaluate(ids => ids.every(id => __audioEvents.some(e =>
    e.id === id && e.kind === 'ended')), ids)).toBe(true);
  expect(await page.evaluate(() => sources.length)).toBe(0);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length)).toBe(starts);
}
async function exportProgress(page) {
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
  const waiting = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  return JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
}
async function importProgress(page, backup) {
  await page.locator('#importFile').setInputFiles({name: 'conversation-backup.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup))});
}

for (const locale of ['nn', 'nb', 'en']) {
  test(`Theme 03 ${locale}: three immediate entrances, four free configurations and keyboard mode choice`, async ({page}) => {
    await openConversation(page, locale);
    for (const mode of ['listen', 'build', 'create']) await expect(cvControl(page, 'mode', mode)).toBeVisible();
    for (const level of [1, 2, 3, 4]) {
      await cvControl(page, 'level', level).click();
      await expect(cvControl(page, 'level', level)).toHaveAttribute('aria-pressed', 'true');
      for (const mode of ['listen', 'build', 'create']) {
        await cvControl(page, 'mode', mode).focus();
        await page.keyboard.press('Enter');
        await expect(cvControl(page, 'mode', mode)).toHaveAttribute('aria-pressed', 'true');
        for (const entrance of ['listen', 'build', 'create']) await expect(cvControl(page, 'mode', entrance)).toBeVisible();
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.brand').click();
    await page.locator('[data-nv="continue"]').click();
    await expect(cvControl(page, 'level', 4)).toHaveAttribute('aria-pressed', 'true');
    await expect(cvControl(page, 'mode', 'create')).toHaveAttribute('aria-pressed', 'true');
  });
}

const callPitches = [60, 62, 64, 67];
const independentFits = (reply, brief) => reply.length === 4 && (
  brief === 'ending' ? reply.slice(0, 3).every((pitch, i) => pitch === callPitches[i]) && reply[3] !== 67 :
  brief === 'home' ? reply[0] === 60 && reply[1] === 62 && reply[3] === 60 :
  brief === 'down' ? reply.slice(1).every((pitch, i) => pitch < reply[i]) :
  reply.every((pitch, i) => pitch === callPitches[i]));
async function hear(page, action, value, key) {
  await cvControl(page, action, value).click();
  await expect.poll(() => page.evaluate(() => cv.busy), {timeout: 6000}).toBe(false);
  if (key) expect(await page.evaluate(key => cv.heard[key], key)).toBe(true);
}

for (const [level, brief] of [[1, 'ending'], [2, 'home'], [3, 'down'], [4, 'home']]) {
  test(`Theme 03 configuration ${level}: native completed listening, all valid choices and one practice credit`, async ({page}) => {
    await openConversation(page);
    await cvControl(page, 'level', level).click();
    if (level === 4) await cvControl(page, 'brief', brief).click();
    await cvControl(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('Play the full call');
    const item = await page.evaluate(() => JSON.parse(JSON.stringify(cv.item)));
    expect(item.call.map(e => e.notes)).toEqual(callPitches);
    expect(item.call.every(e => e.dur === 1)).toBe(true);
    const correct = item.options.flatMap((reply, i) => independentFits(reply.map(e => e.notes), brief) ? [i] : []);
    expect(correct.length).toBeGreaterThan(0);
    expect(correct.length).toBeLessThan(3);
    await hear(page, 'call', undefined, 'call');
    for (const option of [0, 1, 2]) await hear(page, 'option', option, 'option' + option);
    const wrong = [0, 1, 2].find(i => !correct.includes(i));
    await cvControl(page, 'select', wrong).click();
    await cvControl(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('Other replies can be musical');
    expect(await page.evaluate(level => data.conversationPractice.done['listen-' + level] || 0, level)).toBe(0);
    await cvControl(page, 'select', wrong).click();
    for (const index of correct) await cvControl(page, 'select', index).click();
    await cvControl(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('not mastery');
    await cvControl(page, 'check').click();
    expect(await page.evaluate(level => data.conversationPractice.done['listen-' + level], level)).toBe(1);
    await page.reload();
    expect(await page.evaluate(level => data.conversationPractice.done['listen-' + level], level)).toBe(1);
  });
}

for (const [level, brief] of [[1, 'ending'], [2, 'home'], [3, 'down'], [4, 'down']]) {
  test(`Theme 03 configuration ${level}: construct every offered fragment ordering against an independent brief`, async ({page}) => {
    await openConversation(page);
    await cvControl(page, 'level', level).click();
    if (level === 4) await cvControl(page, 'brief', brief).click();
    await cvControl(page, 'mode', 'build').click();
    await cvControl(page, 'check').click();
    await expect(page.locator('.feedback')).toContainText('two different fragments');
    const pieces = await page.evaluate(() => cv.item.pieces.map(p => p.map(e => e.notes)));
    let valid = 0;
    for (const first of [0, 1, 2]) for (const second of [0, 1, 2].filter(i => i !== first)) {
      await cvControl(page, 'clear').click();
      await cvControl(page, 'add', first).focus();
      await page.keyboard.press('Enter');
      await expect(cvControl(page, 'add', first)).toBeDisabled();
      await cvControl(page, 'add', second).click();
      const actual = pieces[first].concat(pieces[second]);
      expect(await page.evaluate(() => cv.order.flatMap(i => cv.item.pieces[i].map(e => e.notes)))).toEqual(actual);
      await cvControl(page, 'check').click();
      const fits = independentFits(actual, brief);
      if (fits) { valid++; await expect(page.locator('.feedback')).toContainText('meets the stated brief'); }
      else await expect(page.locator('.feedback')).not.toContainText('meets the stated brief');
      await cvControl(page, 'remove').click();
      expect(await page.evaluate(() => cv.order.length)).toBe(1);
    }
    expect(valid).toBeGreaterThan(0);
    expect(await page.evaluate(level => data.conversationPractice.done['build-' + level], level)).toBe(1);
  });
}

test('Theme 03 Echo is optional, exact and credited separately from retain/change', async ({page}) => {
  await openConversation(page);
  await cvControl(page, 'echo').click();
  await expect(page.locator('.gr-stage')).toContainText('Optional narrow practice');
  await hear(page, 'call', undefined, 'call');
  for (const option of [0, 1, 2]) await hear(page, 'option', option, 'option' + option);
  await cvControl(page, 'select', 1).click();
  await cvControl(page, 'check').click();
  await expect(page.locator('.feedback')).toContainText('In this Echo exercise');
  await cvControl(page, 'select', 1).click();
  await cvControl(page, 'select', 0).click();
  await cvControl(page, 'check').click();
  expect(await page.evaluate(() => data.conversationPractice.done)).toEqual({'echo-1': 1});
  await cvControl(page, 'mode', 'create').click();
  await expect(page.locator('[data-cv-note]')).toHaveCount(4);
  await expect(cvControl(page, 'save')).toBeEnabled();
});

test('Theme 03 creation: keyboard edit, compare, two legitimate endings, session drafts and saved backup roundtrip', async ({page}) => {
  page.on('dialog', dialog => dialog.accept());
  await openConversation(page);
  await cvControl(page, 'mode', 'create').click();
  await expect(cvControl(page, 'check')).toHaveCount(0);
  // Native select keyboard: G4 -> A4, while every pitch remains editable.
  await page.locator('[data-cv-note="3"]').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-cv-note="3"]')).toHaveValue('69');
  await cvControl(page, 'snapshot').click();
  await expect(cvControl(page, 'previous')).toBeEnabled();
  await page.selectOption('[data-cv-note="3"]', '60');
  const created = await page.evaluate(() => ({reply: cv.response.map(e => e.notes), before: cv.previous.map(e => e.notes)}));
  expect(created).toEqual({reply: [60, 62, 64, 60], before: [60, 62, 64, 69]});
  expect(independentFits(created.reply, 'ending')).toBe(true);
  expect(independentFits(created.before, 'ending')).toBe(true);
  await cvControl(page, 'save').click();
  await cvControl(page, 'save').click();
  await expect(page.locator('.feedback')).toContainText('already saved');
  expect(await page.evaluate(() => data.conversationPractice.creations.length)).toBe(1);
  await cvControl(page, 'mode', 'build').click();
  await cvControl(page, 'level', 2).click();
  await cvControl(page, 'mode', 'create').click();
  await cvControl(page, 'level', 1).click();
  expect(await page.evaluate(() => cv.response.map(e => e.notes))).toEqual(created.reply);
  expect(await page.evaluate(() => cv.previous.map(e => e.notes))).toEqual(created.before);
  const saved = await page.evaluate(() => JSON.parse(JSON.stringify(data.conversationPractice)));
  await page.reload();
  expect(await page.evaluate(() => data.conversationPractice)).toEqual(saved);
  await page.locator('[data-nv="continue"]').click();
  await cvControl(page, 'open', 0).click();
  expect(await page.evaluate(() => cv.response.map(e => e.notes))).toEqual(created.reply);
  const backup = await exportProgress(page);
  expect(backup.conversationPractice).toEqual(saved);
  const existing = await page.evaluate(() => JSON.stringify({data, theme: thStore}));
  const invalid = structuredClone(backup); invalid.conversationPractice.creations[0].response[0].dur = 0.5;
  await importProgress(page, invalid);
  await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');
  expect(await page.evaluate(() => JSON.stringify({data, theme: thStore}))).toBe(existing);
  const older = structuredClone(backup); delete older.conversationPractice;
  await importProgress(page, older);
  await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  expect(await page.evaluate(() => data.conversationPractice)).toEqual(saved);
  const replacement = structuredClone(backup); replacement.conversationPractice.creations = [];
  await importProgress(page, replacement);
  expect(await page.evaluate(() => data.conversationPractice.creations)).toEqual([]);
  await importProgress(page, backup);
  expect(await page.evaluate(() => data.conversationPractice)).toEqual(saved);
  // Language switching must preserve the actual same-origin saved collection.
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-language="nb"]').click();
  expect(await page.evaluate(() => data.conversationPractice)).toEqual(saved);
});

for (const fault of ['quota', 'denied']) test(`Theme 03 ${fault}: save retains in-memory work and an actual downloadable backup`, async ({page}) => {
  await page.addInitScript(mode => {
    if (mode === 'quota') Storage.prototype.setItem = function () { throw new DOMException('Injected quota', 'QuotaExceededError'); };
    else Object.defineProperty(window, 'localStorage', {get() { throw new DOMException('Injected denial', 'SecurityError'); }});
  }, fault);
  await openConversation(page);
  await cvControl(page, 'mode', 'create').click();
  await page.selectOption('[data-cv-note="3"]', '69');
  await cvControl(page, 'save').click();
  await expect(page.locator('.gr-stage')).toContainText('Export before closing');
  const backup = await exportProgress(page);
  expect(backup.conversationPractice.creations[0].response.map(e => e.notes)).toEqual([60, 62, 64, 69]);
});

test('Theme 03 actual decoded samples: native pitch, quarter-note onsets, silent boundary and rendered fundamental', async ({page}) => {
  await nativeObservation(page);
  await openConversation(page);
  await cvControl(page, 'mode', 'create').click();
  await page.selectOption('[data-cv-note="3"]', '69');
  await cvControl(page, 'pair').click();
  await expect.poll(() => page.evaluate(() => __cvNotes.length)).toBe(8);
  const notes = await page.evaluate(() => __cvNotes);
  const expectedPitches = [60, 62, 64, 67, 60, 62, 64, 69];
  notes.forEach((note, i) => {
    expect(note.midi).toBeCloseTo(expectedPitches[i], 5);
    expect(note.duration).toBeGreaterThan(1);
    expect(note.frames).toBeGreaterThan(1000);
    const beat = i < 4 ? i : i + 1;
    expect(note.start - notes[0].start).toBeCloseTo(beat * 60 / 90, 5);
  });
  const ids = await playingIds(page);
  const count = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length);
  await cvControl(page, 'stop').click();
  await assertStopped(page, ids, count);
  // Independently render the actual browser-started sample buffers and rates.
  // Autocorrelation estimates the fundamental from PCM; no m/note metadata is
  // used to select the frequency. This checks pitch material, not speakers,
  // perceived quality, or the complete live mixer/envelope.
  const frequencies = await page.evaluate(async () => {
    const out = [];
    for (const source of __cvNativeSources.slice()) {
      const rate = 44100;
      const offline = new OfflineAudioContext(1, Math.ceil(rate * 0.45), rate);
      const node = offline.createBufferSource();
      node.buffer = source.buffer; node.playbackRate.value = source.rate;
      node.connect(offline.destination); node.start();
      const pcm = (await offline.startRendering()).getChannelData(0);
      const start = Math.floor(rate * 0.08), end = Math.floor(rate * 0.3);
      let energy = 0;
      for (let i = start; i < end; i++) energy += pcm[i] * pcm[i];
      const scores = [];
      let best = -Infinity, bestLag = 0;
      for (let lag = Math.floor(rate / 470); lag <= Math.ceil(rate / 240); lag++) {
        let dot = 0, a = 0, b = 0;
        for (let i = start; i < end; i++) { dot += pcm[i] * pcm[i + lag]; a += pcm[i] ** 2; b += pcm[i + lag] ** 2; }
        const score = dot / Math.sqrt(a * b);
        scores[lag] = score;
        if (score > best) { best = score; bestLag = lag; }
      }
      const a = scores[bestLag - 1], b = scores[bestLag], c = scores[bestLag + 1];
      const offset = Number.isFinite(a + c) ? 0.5 * (a - c) / (a - 2 * b + c) : 0;
      out.push({rms: Math.sqrt(energy / (end - start)), frequency: rate / (bestLag + offset), correlation: best});
    }
    return out;
  });
  frequencies.forEach((signal, i) => {
    expect(signal.rms).toBeGreaterThan(0.0001);
    expect(signal.correlation).toBeGreaterThan(0.5);
    const expectedHz = 440 * 2 ** ((expectedPitches[i] - 69) / 12);
    expect(Math.abs(12 * Math.log2(signal.frequency / expectedHz))).toBeLessThan(0.4);
  });
  test.info().annotations.push({type: 'audio-evidence', description: 'Native decoded sample/rate rendered in OfflineAudioContext; independent PCM autocorrelation. No physical speaker or perceptual approval.'});
});

for (const leave of ['stop', 'home', 'language']) test(`Theme 03 native playback cancellation: ${leave}`, async ({page}) => {
  await nativeObservation(page);
  await openConversation(page);
  await cvControl(page, 'call').click();
  await expect.poll(() => page.evaluate(() => __cvNotes.length)).toBe(4);
  const ids = await playingIds(page), count = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length);
  if (leave === 'stop') await cvControl(page, 'stop').click();
  else if (leave === 'home') await page.locator('.brand').click();
  else {
    // Cross-document recreation check only: this does not establish physical
    // silence in the departed document. Same-document native stops are checked
    // separately above.
    await page.locator('.toolbar-menu summary').click();
    await page.locator('[data-language="nb"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    expect(await page.evaluate(() => ctx)).toBe(null);
    return;
  }
  await assertStopped(page, ids, count);
});

for (const cancel of ['stop', 'navigate']) test(`Theme 03 delayed real sample loading: ${cancel} prevents late native starts`, async ({page}) => {
  await nativeObservation(page);
  let release;
  const barrier = new Promise(resolve => { release = resolve; });
  let requested = 0;
  await page.route('**/sounds/*.mp3', async route => {
    const response = await route.fetch(); requested++;
    await barrier; await route.fulfill({response});
  });
  try {
    await openConversation(page);
    await cvControl(page, 'call').click();
    await expect.poll(() => requested).toBe(5);
    if (cancel === 'stop') await cvControl(page, 'stop').click();
    else await page.locator('.brand').click();
    release();
    await expect.poll(() => page.evaluate(() => buffers?.length || 0)).toBe(5);
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => __cvNotes.length)).toBe(0);
    expect(await page.evaluate(() => sources.length)).toBe(0);
    if (cancel === 'stop') await expect(cvControl(page, 'call')).toBeEnabled();
    else await expect(page.locator('[data-nv="continue"]')).toBeVisible();
  } finally { release(); }
});

test('Theme 03 sample HTTP fault: visible failure, no heard credit, real sample retry', async ({page}) => {
  await nativeObservation(page);
  await page.route('**/sounds/*.mp3', route => route.fulfill({status: 503, body: 'Injected network fault'}));
  await openConversation(page);
  await cvControl(page, 'call').click();
  await expect.poll(() => page.evaluate(() => cv.busy)).toBe(false);
  await expect(page.locator('.gr-stage [role="status"]').first()).toContainText('could not play');
  expect(await page.evaluate(() => cv.heard.call || false)).toBe(false);
  expect(await page.evaluate(() => __cvNotes.length)).toBe(0);
  await page.unroute('**/sounds/*.mp3');
  await hear(page, 'call', undefined, 'call');
  expect(await page.evaluate(() => __cvNotes.length)).toBe(4);
});

test('Theme 03 school levels, disabled routes and saved-history reopening remain restricted', async ({page}) => {
  await page.goto('http://127.0.0.1:8767/school-sites/conversation/en.html');
  await expect(page.locator('#themeSelect option')).toHaveCount(1);
  await page.locator('[data-nv="start"]').click();
  await expect(cvControl(page, 'level')).toHaveCount(2);
  await expect(cvControl(page, 'level', 2)).toHaveAttribute('aria-pressed', 'true');
  await expect(cvControl(page, 'level', 1)).toHaveCount(0);
  await cvControl(page, 'mode', 'create').click();
  await page.selectOption('[data-cv-note="3"]', '60');
  await cvControl(page, 'save').click();
  const backup = await exportProgress(page);
  expect(backup.conversationPractice.creations[0].level).toBe(2);
  page.on('dialog', dialog => dialog.accept());
  await page.goto('http://127.0.0.1:8767/school-sites/theme/en.html');
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
  await importProgress(page, backup);
  expect(await page.evaluate(() => data.conversationPractice.creations.length)).toBe(1);
  await expect(cvControl(page, 'open', 0)).toBeDisabled();
  await page.evaluate(() => go('conversation'));
  expect(await page.evaluate(() => route)).toBe('theme');
  await expect(page.locator('[data-cv-action="mode"]')).toHaveCount(0);
});

test('Theme 03 keyboard: Add/Remove focus and native playback Stop returns to initiating control', async ({page}) => {
  await nativeObservation(page);
  await openConversation(page);
  await cvControl(page, 'mode', 'build').focus(); await page.keyboard.press('Enter');
  await cvControl(page, 'add', 0).focus(); await page.keyboard.press('Enter');
  await expect(cvControl(page, 'remove')).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => cv.order)).toEqual([]);
  await cvControl(page, 'piece', 0).focus(); await page.keyboard.press('Enter');
  await expect(cvControl(page, 'stop')).toBeFocused();
  await expect.poll(() => page.evaluate(() => __cvNotes.length)).toBe(2);
  const ids = await playingIds(page), count = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length);
  await page.keyboard.press('Enter');
  await assertStopped(page, ids, count);
  await expect(cvControl(page, 'piece', 0)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(cvControl(page, 'stop')).toBeFocused();
  await expect.poll(() => page.evaluate(() => cv.busy), {timeout: 6000}).toBe(false);
  await expect(cvControl(page, 'piece', 0)).toBeFocused();
});

test('Theme 03 explicit old Echo backup migrates separately, without retain/change credit', async ({page}) => {
  page.on('dialog', dialog => dialog.accept());
  await openConversation(page);
  const backup = await exportProgress(page);
  const event = notes => ({notes, dur: 1});
  const legacy = {version: 1, level: 1, done: {'listen-1': 2, 'build-1': 1}, creations: [
    {level: 1, call: [60, 62, 64, 67].map(event), response: [64, 67].map(event)},
  ]};
  backup.conversationPractice = legacy;
  await importProgress(page, backup);
  await expect(page.locator('#importFeedback')).toHaveClass('feedback good');
  const migrated = await page.evaluate(() => data.conversationPractice);
  expect(migrated).toEqual({version: 2, level: 1, done: {}, creations: [], legacyEcho: legacy});
  await expect(page.locator('#app')).toContainText('Older Echo work is preserved separately');
  await page.reload();
  expect(await page.evaluate(() => data.conversationPractice)).toEqual(migrated);
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-go="progress"]').click();
  const waiting = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const exported = JSON.parse(fs.readFileSync(await (await waiting).path(), 'utf8'));
  expect(exported.conversationPractice).toEqual(migrated);
});

test('Theme 03 different worked example is sounded accurately and supplies no assessment heard-credit', async ({page}) => {
  await nativeObservation(page);
  await openConversation(page);
  await cvControl(page, 'model').click();
  await expect.poll(() => page.evaluate(() => __cvNotes.length)).toBe(8);
  const notes = await page.evaluate(() => __cvNotes);
  expect(notes.map(note => Math.round(note.midi))).toEqual([62, 64, 67, 69, 62, 64, 67, 60]);
  expect(notes[4].start - notes[0].start).toBeCloseTo(5 * 60 / 90, 5);
  const ids = await playingIds(page), count = await page.evaluate(() => __audioEvents.filter(e => e.kind === 'start').length);
  await cvControl(page, 'stop').click();
  await assertStopped(page, ids, count);
  expect(await page.evaluate(() => cv.heard)).toEqual({});
  await cvControl(page, 'check').click();
  await expect(page.locator('.feedback')).toContainText('Play the full call');
  expect(await page.evaluate(() => data.conversationPractice.done)).toEqual({});
});
