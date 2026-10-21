const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'docs/theme03-design/examples.json')));
const doc = fs.readFileSync(path.join(root, 'CONTENT_DESIGN_THEME03.md'), 'utf8');
// Parse the final review artifact, not just its source JSON. Applies to all examples.
for (const e of data.examples) {
  const section = doc.split(`### ${String(e.id).padStart(2, '0')}. `)[1]?.split('\n### ')[0];
  assert.ok(section, `missing example ${e.id}`);
  assert.ok(section.includes(`**Rule taught first:** ${e.rule}`), `rule ${e.id}`);
  assert.ok(section.includes(`**Accepted set:** ${e.accepted.join(', ')}.`), `answers ${e.id}`);
  assert.ok(section.includes(`**Misconception and proposed feedback:** ${e.feedback}`), `feedback ${e.id}`);
  const rows = [...section.matchAll(/^\| (Call|[ABC]) \| `([^`]+)` \| (.+) \|$/gm)];
  assert.equal(rows.length, 4);
  const cues = e.audioCues.map(c => `${c.label} ${c.startSeconds.toFixed(2)}–${c.endSeconds.toFixed(2)}s`).join('; ');
  assert.ok(section.includes(`**Audio cues:** ${cues}.`), `audio cues ${e.id}`);
  rows.forEach(([_, label, notes, decision], i) => {
    const parsed = notes.split(' ').map(token => {
      const m = /^(?:([A-G][#b]?)(\d)\((\d+)\)|R):([\d.]+)$/.exec(token);
      assert.ok(m, token);
      if (m[1]) {
        const pitch = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1][0]] + (m[1].includes('#') ? 1 : m[1].includes('b') ? -1 : 0) + 12 * (Number(m[2]) + 1);
        assert.equal(pitch, Number(m[3]), `note name/MIDI ${token}`);
      }
      return [m[3] ? Number(m[3]) : null, Number(m[4])];
    });
    assert.deepEqual(parsed, i === 0 ? e.call : e.alternatives[i - 1], `document notes ${e.id}/${label}`);
    if (i) assert.equal(decision.startsWith('Meets the stated brief'), e.accepted.includes(label));
    if (i && e.responseStarts) assert.equal(Number(/starts ([\d.]+) beats/.exec(decision)?.[1]), e.responseStarts[i - 1]);
  });
}
// Independent musical contract: a pickup G, then a complete bar E-D-C.
const e = data.examples[6];
assert.equal(e.id, 7);
assert.deepEqual(e.call, [[60,1],[62,1],[64,1],[null,1]]);
assert.deepEqual(e.responseStarts, [3,3.5,4]);
assert.deepEqual(e.alternatives, Array.from({length:3}, () => [[67,.5],[64,1],[62,1],[60,2]]));
assert.deepEqual(e.accepted, ['B']);
assert.match(e.rule, /G4\(67\).*half-beat pickup on the & of beat 4/);
assert.match(e.rule, /E4\(64\) for one beat, D4\(62\) for one beat and C4\(60\) for two beats/);
assert.deepEqual(e.responseStarts.map(start => start + .5), [3.5,4,4.5]);
assert.equal(data.tempoBpm, 90);
assert.deepEqual(e.audioCues.map(c => [c.label,c.startSeconds,c.endSeconds]), [['Call',0,2.917],['A',3.917,12.5],['B',13.5,22.083],['C',23.083,31.667]]);
console.log('Theme 03 design: final document, notes, rules, answers and entry offsets agree.');
