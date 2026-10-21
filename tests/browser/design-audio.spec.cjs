const {test, expect} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('design Example 7 MP3: pickup pitches and call-relative entry offsets', async ({page}) => {
  await page.goto('/');
  const bytes = fs.readFileSync(path.resolve(__dirname, '../../docs/theme03-design/07.mp3')).toString('base64');
  // Inspect the actual committed recording, independently of the JSON and Markdown.
  // This is decoded-signal evidence, not speaker output or human musical review.
  const observations = await page.evaluate(async encoded => {
    const ctx = new AudioContext();
    try {
      const buffer = await ctx.decodeAudioData(Uint8Array.from(atob(encoded), c => c.charCodeAt(0)).buffer);
      const pcm = buffer.getChannelData(0), sr = buffer.sampleRate;
      function energy(time, pitch) {
        const n = Math.round(.085 * sr), start = Math.round(time * sr);
        const f = 440 * 2 ** ((pitch - 69) / 12), w = 2 * Math.PI * f / sr;
        let re = 0, im = 0;
        for (let j = 0; j < n; j++) {
          const x = (pcm[start + j] || 0) * (.5 - .5 * Math.cos(2 * Math.PI * j / (n - 1)));
          re += x * Math.cos(w * j); im += x * Math.sin(w * j);
        }
        return re * re + im * im;
      }
      const notes = [], onsets = [];
      // Each alternative has its own four-beat count-in and complete call.
      for (const [segment, entry] of [[3.917,3],[13.5,3.5],[23.083,4]]) {
        const call = segment + 4 * 2 / 3;
        for (const [offset, pitch] of [[0,60],[1,62],[2,64],[entry,67],[entry+.5,64],[entry+1.5,62],[entry+2.5,60]]) {
          const t = call + offset * 2 / 3 + .13;
          const measured = [60,62,64,67].sort((a,b) => energy(t,b) - energy(t,a))[0];
          notes.push({pitch, measured});
        }
        const expected = call + entry * 2 / 3;
        // G is absent in the call and only appears as the pickup: locate its attack.
        const samples = [];
        for (let t = expected - .24; t < expected + .24; t += .005) samples.push([t,energy(t,67)]);
        const peak = Math.max(...samples.map(x => x[1]));
        const attack = samples.find(x => x[1] > peak * .18)[0];
        // Window is 85ms long, so detection begins before the physical attack.
        onsets.push({expected, measured: attack + .04});
      }
      return {notes,onsets};
    } finally { await ctx.close(); }
  }, bytes);
  for (const note of observations.notes) expect(note.measured, JSON.stringify(note)).toBe(note.pitch);
  for (const onset of observations.onsets) expect(Math.abs(onset.measured-onset.expected), JSON.stringify(onset)).toBeLessThan(.075);
});
