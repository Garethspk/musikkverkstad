const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const {assess, regressionSuites, contentHash} = require('../scripts/quality-gate.cjs');
assert.equal(assess([]).pupilRelease, 'FAIL');
assert.equal(assess([{status: 'FAIL'}]).pupilRelease, 'FAIL');
assert.equal(assess([{status: 'PASS'}]).pupilRelease, 'BLOCKED');
assert.equal(assess([{status: 'PASS'}, {status: 'BLOCKED'}]).codeChecks, 'FAIL');
assert.equal(assess([{name: 'browser', status: 'FAIL'}]).pupilRelease, 'FAIL');
assert.deepEqual(assess([{name: 'browser', status: 'PASS'}]).requiredEvidence,
  {browser: 'BLOCKED', renderedAudio: 'BLOCKED', realDevices: 'BLOCKED', independentReview: 'BLOCKED'});
const root = path.resolve(__dirname, '..');
const suites = regressionSuites(root);
for (const suite of ['audio', 'full-audit', 'groove', 'navigation', 'notation', 'piano', 'practice',
  'puzzle', 'quality-gate', 'quality-regressions', 'sound-compare', 'studio', 'theme']) {
  assert.ok(suites.includes(suite + '.cjs'), 'Missing regression suite: ' + suite);
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'musikkverkstad-gate-'));
try {
  // Hash tests use isolated fixture files, not simulated browser/device evidence.
  for (const dir of ['src', 'dist', 'tests', 'scripts', '.github']) fs.mkdirSync(path.join(temp, dir));
  for (const file of ['translate.py', 'translations-extra.txt', 'README.md', 'AGENTS.md',
    'PROJECT_REQUIREMENTS.md', 'PROJECT_STATUS.md', 'ROADMAP.md', 'docs/development-quality.md', 'package.json', 'package-lock.json', 'playwright.config.cjs']) {
    fs.mkdirSync(path.dirname(path.join(temp, file)), {recursive: true});
    fs.writeFileSync(path.join(temp, file), file);
  }
  const withoutHosting = contentHash(temp);
  assert.equal(contentHash(temp), withoutHosting, 'Hash must be stable without hosting metadata');
  fs.mkdirSync(path.join(temp, '.openai'));
  fs.writeFileSync(path.join(temp, '.openai/hosting.json'), '{}');
  const withHosting = contentHash(temp);
  assert.notEqual(withHosting, withoutHosting, 'Hosting presence must affect the hash');
  fs.writeFileSync(path.join(temp, '.openai/hosting.json'), '{"fixture":true}');
  assert.notEqual(contentHash(temp), withHosting, 'Hosting content must affect the hash');
  fs.rmSync(path.join(temp, '.openai'), {recursive: true});
  assert.equal(contentHash(temp), withoutHosting);
  fs.writeFileSync(path.join(temp, 'tests/new.cjs'), '');
  assert.ok(regressionSuites(temp).includes('new.cjs'), 'Future suites must be discovered');
  assert.notEqual(contentHash(temp), withoutHosting, 'Tests must affect candidate identity');
  fs.rmSync(path.join(temp, 'package-lock.json'));
  assert.throws(() => contentHash(temp), /ENOENT/, 'Required inputs must not silently become optional');
} finally { fs.rmSync(temp, {recursive: true, force: true}); }
console.log('PASS: fail/blocked release decisions, suite discovery, required inputs and optional provenance hashing');
