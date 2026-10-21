const {test: base, expect} = require('@playwright/test');

const test = base.extend({
  page: async ({page, browser}, use, testInfo) => {
    testInfo.annotations.push({type: 'browser-version', description: browser.version()});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      // HTTP failure messages belong to explicit network-fault tests, not JS errors.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(message.text());
    });
    await use(page);
    expect(errors, 'Uncaught JavaScript errors / console errors').toEqual([]);
  },
});

async function openApp(page, locale = 'en') {
  await page.goto('/' + locale + '.html');
  await expect(page.locator('[data-nv="start"]')).toBeVisible();
}

// Observation only: invoke the native methods, retain native buffers/timing,
// and record successful calls. No fake AudioContext, decoding or completion.
async function observeAudio(page) {
  await page.addInitScript(() => {
    const events = [];
    const ids = new WeakMap();
    let nextId = 0;
    function id(source) { if (!ids.has(source)) ids.set(source, ++nextId); return ids.get(source); }
    window.__audioEvents = events;
    const proto = AudioBufferSourceNode.prototype;
    const start = proto.start, stop = proto.stop;
    proto.start = function (...args) {
      const result = start.apply(this, args);
      events.push({kind: 'start', id: id(this), duration: this.buffer?.duration, frames: this.buffer?.length,
        rate: this.playbackRate.value, time: this.context.currentTime, scheduled: args[0]});
      this.addEventListener('ended', () => events.push({kind: 'ended', id: id(this)}), {once: true});
      return result;
    };
    proto.stop = function (...args) {
      const result = stop.apply(this, args);
      events.push({kind: 'stop', id: id(this), time: this.context.currentTime, scheduled: args[0] ?? 0});
      return result;
    };
  });
}
module.exports = {test, expect, openApp, observeAudio};
