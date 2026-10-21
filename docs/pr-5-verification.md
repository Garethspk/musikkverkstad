# PR #5 verification discrepancies

## Preview language → ZIP download

The failure was reproduced using the real setup/pupil files, native audio decoding,
opaque preview iframe and ordinary Playwright mouse/touch input. No application
functions, network results or browser policy were substituted.

Local browser: Debian Chromium **154.0.8037.57**, explicitly selected with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Playwright **1.64.1** pins
Chrome for Testing / headless shell **156.0.8078.4**, revision **1248**, used by CI.
The local alternate executable is not the Playwright-matched browser.

Six instrumented trials (three desktop, three mobile viewport) reproduced the
failure immediately after language replacement and automatic scrolling back to
Download. Parent capture listeners received no download-button pointer/click event.
The new iframe instead received the pointer at coordinates corresponding to its
**previous** screen position, even though layout reported it below the viewport
and the button enabled/in view. The administrator was not busy and its status had
not entered packaging. Keyboard activation of the same button then produced the
actual ZIP in all six diagnostic trials. Thus this was not a rejected template,
failed ZIP generation, lost application click handler or expired download URL.

Comparison: explicitly scroll the button into view, allow two animation frames for
scroll rendering/compositor hit-testing, then issue exactly one native click/tap.
All six comparison trials delivered the trusted pointer to the parent button and
downloaded the ZIP; the iframe received no input from that action. This supports
classification as a **browser/input timing discrepancy** in the local alternate
Chromium, rather than a demonstrated application packaging defect. It is not proof
that all browser versions are defect-free or an upstream Chromium bug diagnosis.

The test helper now synchronises rendering before the existing pointer action.
It retains the actual download wait, ZIP extraction, CRC, manifest/settings identity,
branding/audio and no-editor assertions. There is no sleep, retry, forced/DOM click,
keyboard substitution or security-policy change. A new regression switches all
three preview languages, scrolls back and downloads with one trusted pointer action
per language, checking the same candidate identity and unchanged default language.
The application implementation and sandbox/CSP have not changed for this repair.

Repeat verification command:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/package.spec.cjs --grep 'real candidate|language replacement' --repeat-each=3
```

## Standalone file navigation

`/etc/chromium/policies/managed/urls.json` sets `URLBlocklist: ["*"]`; its
`URLAllowlist` allows HTTP/HTTPS and selected internal routes but **not file://**.
Both standalone tests therefore fail at `page.goto(file://…/setup/index.html)`
with **net::ERR_BLOCKED_BY_ADMINISTRATOR**, before any setup script executes.
They exercise one workflow twice, in the desktop/mobile projects, rather than two
separate application defects. The ordinary GitHub-hosted Playwright browser has no
such managed file-navigation restriction; its standalone tests run unchanged.

This is distinct from the pupil app's documented need for static HTTP audio:
the self-contained administrator embeds its assets and is designed to open locally;
the extracted pupil ZIP must be served over HTTP. Testing the administrator over
localhost verifies HTTP operation, not standalone-file operation.

No managed policy, Chromium flags, sandbox or CSP is changed. The two standalone
tests stay enabled and keep their original assertions. A full gate in this local
environment therefore still fails; it is not relabelled PASS or exempted. CI gives
separate real-browser standalone evidence, not physical Windows/Edge or phone
verification. Neither CI nor viewport tests establish audible speaker output.

## Release and review boundaries

The two existing Theme 01 quick-entry tab failures remain explicit expected failures.
No new expected-failure annotation or skipped test is added. Standard gate semantics
are intact: actual failed checks yield FAIL, while successful development checks
still yield pupilRelease BLOCKED with required evidence BLOCKED. Private prototype
success never grants pupil-release approval. CI must also verify generated-file
freshness. See PR #5 for the exact tested commit, final check counts and Actions run.
No merge, deployment, pupil-ready export or original Work website change is made.
