# Development quality workflow

Phase 1 adds repeatable development checks without changing the application,
translations, curriculum, deployment or pupil-release policy.

## Reproduce locally

Use Node 24, Python 3.12 and the committed npm lockfile:

```sh
npm ci
npx playwright install --with-deps chromium
npm run quality
```

The gate builds all three languages, discovers and runs every `tests/*.cjs`
script (all 13 original suites, including sound-compare), then runs Playwright.
`PYTHON` can select a Python 3 executable; the default is `python3`.

Exit codes:

- **1**: development checks failed; all publication blocked.
- **2**: development checks passed; pupil release remains **BLOCKED**.
- **0**: only with `npm run quality:prototype`, after passing development checks.
  This is private-prototype development eligibility, never pupil approval.

For browser tests alone, first run `npm run build`, then `npm run test:browser`.
A missing browser/dependency or occupied server port fails the checks. Playwright serves `dist` on 127.0.0.1:8765, the separate administrator `setup`
artifact on port 8766 and configured test builds under `.quality` on port 8767;
all three local servers are stopped after testing.
If browser downloads are restricted but a compatible Chromium is installed,
explicitly set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. This is
an alternate local runtime, not identical to CI's Playwright-managed browser.
The browser version is recorded in test annotations.

## Evidence and known limitation

The 13 original Node suites remain logic/DOM/Web Audio simulations. Playwright uses real
headless Chromium with desktop (1280×800) and mobile (390×844, touch) profiles.
A mobile viewport is **not a physical phone** and does not test Safari/iOS.

UI coverage includes both themes, visible activity controls in Theme 01 Explore
and Theme 02, all three language links and saved-language redirection, selected
states, keyboard activation/menu/Escape/focus, and uncaught JavaScript and console
errors. The layout check covers the exercised theme screen, not every possible
screen, zoom level or assistive technology.

The former Theme 01 quick-entry activity-tab omission is fixed in Phase 3.
Its two viewport cases are ordinary passing regressions; the matching expected-failure
marker has been removed. New tests cover every entrance, keyboard selection and
level preservation in all locales. Theme 02 tests cover versioned history, real
browser persistence and backup round-trips, restricted-school history and injected
storage failures. No new expected failure or skip is used to hide broken checks.

Audio tests click real controls, initialise native Web Audio, fetch/decode the
five actual MP3s, observe native buffer-source start/stop/ended events, and check
Stop and navigation for all eight activity routes. Observation wrappers forward
to native methods; they do not replace decoding, audio contexts or completion.
Delayed-network tests hold real MP3 responses; the failure/retry case deliberately
injects HTTP 503 before retrying the real files. These are controlled network
faults, not evidence about real-world network reliability.

These tests establish browser initialisation/decoding/control behaviour. They
**do not verify audible speaker output, perceived pitch/timbre, rendered PCM,
physical-device audio routing, pupil usability or independent musical review**.
All four release-evidence fields remain BLOCKED, including the broader browser
evidence requirement. The development browser result does not act as a release
evidence adapter.

## Gate identity and optional hosting provenance

The original gate only read `.openai/hosting.json` while calculating a content
hash; no build/test/release decision consumed its deployment values. The GitHub
import omitted it. Development therefore treats it as optional deployment
provenance. Its explicit absence/presence and any supplied bytes affect the hash.
No original Site ID or hosting details have been fabricated, and no deployment
permission follows from this file's presence. Missing required application or
quality-workflow files still fails the gate.

The report binds results to the candidate hash captured after building and before
regressions, and rejects changed candidate files during verification. The hash
covers source, generated pupil and separate setup output, tests, scripts, CI workflow, build inputs,
requirements/status/roadmap, this workflow documentation, npm manifest/lockfile
and Playwright configuration. It is
independent of the checkout path. The base Git commit is recorded separately;
uncommitted candidate content is identified by the content hash, not by pretending
it is already committed. Reports are cleared before each run so a failed attempt
cannot leave an old successful `latest.json` behind.

## CI and artifacts

`.github/workflows/quality.yml` runs on main pushes, pull requests and manual
invocation. It installs the locked dependencies and matching Chromium, runs the
prototype development gate, checks committed `dist` against the rebuild and
uploads reports even after failure. It has read-only repository permissions and
contains no deployment step. Branch protection must be configured separately if
this check is to be required for merging.

- `.quality/latest.json`: candidate identity, each build/suite/browser result,
  known browser failures and explicit release BLOCKED/FAIL decision.
- `.quality/browser.json`: full Playwright JSON report.
- `playwright-report/`: browsable HTML results.
- `test-results/`: failure screenshots and traces.

GitHub Actions has not been executed merely by adding the workflow locally.

Issue16 added visual Form tests in both viewport profiles. With Week 4, the expanded
420-case suite completed locally in about 698 seconds with four workers, exceeding
the former ten-minute aggregate ceiling. The whole-browser-process ceiling is now
15 minutes. Individual 30-second test bounds, five-second assertion bounds, every
test case, zero retries and all security/release/failure decisions stay unchanged.
Managed local file-URL policy refusals remain failures; extra aggregate time does
not waive them. Form's visual objective is tested without audio initialization;
unrelated native audio and required release evidence remain part of the full gate.
