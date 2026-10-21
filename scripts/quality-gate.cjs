const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');

function assess(checks) {
  const code = checks.length > 0 && checks.every(c => c.status === 'PASS') ? 'PASS' : 'FAIL';
  return {
    codeChecks: code,
    pupilRelease: code === 'FAIL' ? 'FAIL' : 'BLOCKED',
    requiredEvidence: {browser: 'BLOCKED', renderedAudio: 'BLOCKED', realDevices: 'BLOCKED', independentReview: 'BLOCKED'},
    reason: 'Development checks include limited Chromium UI and Web Audio tests. Comprehensive version-bound browser, rendered-audio, physical-device and independent-review evidence is still unavailable. Development checks cannot approve a pupil release.',
  };
}

function regressionSuites(root) {
  // Discover every existing Node suite, including sound-compare and future additions.
  return fs.readdirSync(path.join(root, 'tests')).filter(f => f.endsWith('.cjs')).sort();
}

function contentHash(root) {
  const hash = crypto.createHash('sha256');
  function add(relative) {
    const bytes = fs.readFileSync(path.join(root, relative));
    hash.update(JSON.stringify([relative, bytes.length]) + '\n');
    hash.update(bytes);
  }
  function scan(relative) {
    for (const item of fs.readdirSync(path.join(root, relative), {withFileTypes: true}).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const file = path.posix.join(relative, item.name);
      if (item.isDirectory()) scan(file); else add(file);
    }
  }
  for (const dir of ['src', 'dist', 'setup', 'tests', 'scripts', '.github']) scan(dir);
  for (const file of ['translate.py', 'translations-extra.txt', 'README.md', 'AGENTS.md',
    'PROJECT_REQUIREMENTS.md', 'PROJECT_STATUS.md', 'ROADMAP.md', 'docs/development-quality.md', 'docs/school-setup.md', 'package.json', 'package-lock.json', 'playwright.config.cjs']) add(file);
  // Work hosting metadata is optional provenance, not a development dependency.
  // Include absence/presence in the candidate identity; never reconstruct a Site ID.
  const hosting = '.openai/hosting.json';
  const present = fs.existsSync(path.join(root, hosting));
  hash.update(JSON.stringify([hosting, present ? 'present' : 'absent']) + '\n');
  if (present) add(hosting);
  return hash.digest('hex');
}

function run(root = path.resolve(__dirname, '..')) {
  process.chdir(root);
  fs.mkdirSync('.quality', {recursive: true});
  // Never leave an old successful report behind after a new failed invocation.
  for (const file of ['.quality/latest.json', '.quality/browser.json']) fs.rmSync(file, {force: true});
  const checks = [];
  let candidateHash = null;
  let browserCLI;
  try { browserCLI = require.resolve('@playwright/test/cli'); } catch { /* recorded below */ }
  const commands = [
    ['build', process.env.PYTHON || 'python3', ['translate.py']],
    ...regressionSuites(root).map(file => [file, process.execPath, ['tests/' + file]]),
    ['browser', process.execPath, browserCLI ? [browserCLI, 'test'] : []],
  ];
  for (const [name, command, args] of commands) {
    const result = name === 'browser' && !browserCLI
      ? {status: 1, error: new Error('Playwright is missing. Run npm ci and npx playwright install chromium.')}
      : spawnSync(command, args, {encoding: 'utf8', timeout: name === 'browser' ? 300000 : 60000, maxBuffer: 16 * 1024 * 1024});
    const status = result.status === 0 && !result.error ? 'PASS' : 'FAIL';
    checks.push({name, status, exitCode: result.status, output: (result.stdout || '') + (result.stderr || ''), error: result.error?.message || null});
    console.log(name + ': ' + status);
    if (status === 'FAIL') break;
    if (name === 'build') candidateHash = contentHash(root);
  }
  const finalHash = contentHash(root);
  if (candidateHash && candidateHash !== finalHash) checks.push({name: 'candidate-stability', status: 'FAIL', error: 'Candidate files changed during verification.'});
  let browser = null;
  if (fs.existsSync('.quality/browser.json')) {
    const result = JSON.parse(fs.readFileSync('.quality/browser.json', 'utf8'));
    const cases = [];
    function collect(suites) { for (const suite of suites) {
      for (const spec of suite.specs || []) for (const test of spec.tests || []) cases.push({title: spec.title, project: test.projectName, expectedStatus: test.expectedStatus, status: test.status, annotations: test.annotations});
      collect(suite.suites || []);
    }}
    collect(result.suites || []);
    browser = {passed: cases.filter(t => t.expectedStatus === 'passed' && t.status === 'expected').length, stats: result.stats, knownFailures: cases.filter(t => t.expectedStatus === 'failed'), cases, scope: 'Headless Chromium desktop/mobile viewports; native Web Audio and bundled MP3 decoding. No physical-device, speaker, Safari or pupil verification.'};
  }
  const report = {
    createdAt: new Date().toISOString(),
    baseCommit: spawnSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).stdout?.trim() || null,
    contentHash: finalHash,
    deploymentConfiguration: {path: '.openai/hosting.json', present: fs.existsSync('.openai/hosting.json'), requiredForDevelopment: false},
    runtime: {node: process.version},
    ...assess(checks), checks, browser,
  };
  fs.writeFileSync('.quality/latest.json', JSON.stringify(report, null, 2) + '\n');
  console.log('Code checks: ' + report.codeChecks + '; pupil release: ' + report.pupilRelease);
  console.log('Report: .quality/latest.json');
  return report.codeChecks === 'FAIL' ? 1 : process.argv.includes('--prototype') ? 0 : 2;
}
module.exports = {assess, regressionSuites, contentHash};
if (require.main === module) {
  try { process.exitCode = run(); }
  catch (error) {
    // Invalid/missing required inputs are failures, never prototype approvals.
    fs.mkdirSync('.quality', {recursive: true});
    fs.writeFileSync('.quality/latest.json', JSON.stringify({createdAt: new Date().toISOString(), ...assess([{status: 'FAIL'}]), error: error.message}, null, 2) + '\n');
    console.error(error.message);
    process.exitCode = 1;
  }
}
