const {test, expect, openApp, observeAudio} = require('./fixtures.cjs');

const starts = page => page.evaluate(() => window.__audioEvents.filter(e => e.kind === 'start'));
async function activeIds(page) {
  return page.evaluate(() => window.__audioEvents.filter(e => e.kind === 'start' &&
    !window.__audioEvents.some(end => end.kind === 'ended' && end.id === e.id)).map(e => e.id));
}
async function verifyStopped(page, ids, count) {
  expect(ids.length).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => sources.length)).toBe(0);
  expect(await page.evaluate(ids => ids.every(id => window.__audioEvents.some(e =>
    e.kind === 'stop' && e.id === id && e.scheduled === 0)), ids)).toBe(true);
  await expect.poll(() => page.evaluate(ids => ids.every(id => window.__audioEvents.some(e =>
    e.kind === 'ended' && e.id === id)), ids)).toBe(true);
  await page.waitForTimeout(250); // Observe that queued callbacks do not restart playback.
  expect((await starts(page)).length).toBe(count);
}
async function stopAndVerify(page) {
  const count = (await starts(page)).length;
  const ids = await activeIds(page);
  await page.locator('[data-stop], [data-gr-action="stop"], [data-pp-action="stop"], [data-nm-action="stop"]').first().click();
  await verifyStopped(page, ids, count);
}

test.beforeEach(async ({page}) => { await observeAudio(page); });

test('native audio initialisation, actual MP3 loading and Test sound completion', async ({page}) => {
  const responses = [];
  page.on('response', response => { if (response.url().endsWith('.mp3')) responses.push(response); });
  await openApp(page);
  await page.locator('.toolbar-menu summary').click();
  await page.locator('[data-test-audio]').click();
  await expect.poll(async () => (await starts(page)).length).toBe(3);
  expect(responses).toHaveLength(5);
  expect(responses.every(r => r.status() === 200)).toBe(true);
  const decoded = await page.evaluate(() => ({state: ctx.state, samples: buffers.map(s => ({duration: s.buffer.duration, frames: s.buffer.length, peak: s.peak}))}));
  expect(decoded.state).toBe('running');
  expect(decoded.samples).toHaveLength(5);
  for (const sample of decoded.samples) {
    expect(sample.duration).toBeGreaterThan(1);
    expect(sample.frames).toBeGreaterThan(1000);
    expect(sample.peak).toBeGreaterThan(0);
  }
  await expect.poll(() => page.evaluate(() => window.__audioEvents.filter(e => e.kind === 'ended').length)).toBe(3);
});

for (const activity of [
  {name: 'Theme 01', route: 'theme', play: '[data-theme-action="play"][data-theme-value="reference"]'},
  {name: 'Theme 02', route: 'groove', play: '[data-gr-action="reference"]'},
  {name: 'Rhythm', route: 'rhythm', play: '[data-play="target"]'},
  {name: 'Melody', route: 'melody', play: '[data-play="target"]'},
  {name: 'Harmony', route: 'harmony', play: '[data-play="target"]'},
  {name: 'Workshop', route: 'create', play: '[data-play="creation"]'},
  {name: 'Phrase Puzzle', route: 'puzzle', play: '[data-pp-action="whole"]'},
  {name: 'Notation Match', route: 'notation', play: '[data-nm-action="play"]'},
]) {
  test(`${activity.name}: real playback, Stop and navigation cancellation`, async ({page}) => {
    await openApp(page);
    if (activity.route === 'theme') {
      await page.locator('[data-nv="start"]').click();
      await page.locator('[data-theme-action="explore"]').click();
    } else if (activity.route === 'groove') {
      await page.selectOption('#themeSelect', '1');
    } else await page.locator(`[data-go="${activity.route}"]`).first().click();
    await page.locator(activity.play).click();
    await expect.poll(async () => (await starts(page)).length).toBeGreaterThan(0);
    expect((await starts(page)).every(e => e.duration > 1 && e.frames > 1000)).toBe(true);
    await stopAndVerify(page);
    const before = (await starts(page)).length;
    await page.locator(activity.play).click();
    await expect.poll(async () => (await starts(page)).length).toBeGreaterThan(before);
    const playing = (await starts(page)).length;
    const ids = await activeIds(page);
    await page.locator('.brand').click();
    await expect(page.locator('[data-nv="continue"]')).toBeVisible();
    await verifyStopped(page, ids, playing);
  });
}

for (const cancel of ['stop', 'navigate']) {
  test(`cancel during delayed sample loading: ${cancel}`, async ({page}) => {
    let release;
    const barrier = new Promise(resolve => { release = resolve; });
    let requested = 0, delivered = 0;
    await page.route('**/sounds/*.mp3', async route => {
      const response = await route.fetch();
      requested++;
      await barrier;
      await route.fulfill({response});
      delivered++;
    });
    try {
      await openApp(page);
      await page.selectOption('#themeSelect', '1');
      await page.locator('[data-gr-action="reference"]').click();
      await expect.poll(() => requested).toBe(5);
      expect(await starts(page)).toHaveLength(0);
      if (cancel === 'navigate') await page.locator('.brand').click();
      else await page.locator('[data-gr-action="stop"]').click();
      release();
      await expect.poll(() => delivered).toBe(5);
      await expect.poll(() => page.evaluate(() => buffers?.length || 0)).toBe(5);
      await page.waitForTimeout(250);
      expect(await starts(page)).toHaveLength(0);
      expect(await page.evaluate(() => sources.length)).toBe(0);
      if (cancel === 'navigate') await expect(page.locator('[data-nv="continue"]')).toBeVisible();
      else await expect(page.locator('[data-gr-action="reference"]')).toBeEnabled();
    } finally { release(); }
  });
}

test('sample HTTP failure gives feedback, never starts sound, and allows retry', async ({page}) => {
  // Deliberate network fault; the successful retry still decodes real bundled MP3s.
  await page.route('**/sounds/*.mp3', route => route.fulfill({status: 503, body: 'Injected test failure'}));
  await openApp(page);
  await page.selectOption('#themeSelect', '1');
  await page.locator('[data-gr-action="reference"]').click();
  await expect(page.locator('#audioStatus')).toBeVisible();
  await expect(page.locator('#audioStatus')).toContainText('could not load');
  await expect(page.locator('[data-gr-action="reference"]')).toBeEnabled();
  expect(await starts(page)).toHaveLength(0);
  await page.unroute('**/sounds/*.mp3');
  await page.locator('[data-gr-action="reference"]').click();
  await expect.poll(async () => (await starts(page)).length).toBeGreaterThan(0);
  await stopAndVerify(page);
});
