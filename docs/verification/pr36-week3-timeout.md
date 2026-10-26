# PR36: Week3 school-restrictions timeout investigation

Candidate investigated: `ec41f9e7470b67fb1e14d3ebb0ef4dbbab6eea77`.
Test: `tests/browser/week3.spec.cjs:110`,
“independent school source restrictions and programme opt-out reject routes/actions without erasing history”.
Native Chromium154.0.8037.57 / Playwright1.64.1, desktop and mobile emulation.
These are browser observations, not physical-device, teacher, pupil or human AT evidence.
Human validation PENDING; pupil release BLOCKED. PR36 remains draft; no merge/deploy.

## Finding

The **whole test's 30000ms budget expired**, rather than an operation waiting30s.
It combines four complete settings imports/preview constructions plus interaction
and denial/history assertions. In the failed full four-worker local suite, those
operations accumulated enough elapsed time to exhaust the budget at the fourth,
programme-disabled configuration.

The evidence supports **local full-suite execution latency/contention** as the
best-supported classification. No application defect or synchronization hang was
reproduced. This is not proof of a specific CPU/memory/I/O bottleneck: there was no
contemporaneous machine-resource telemetry, so the precise resource cause remains
unverified. No speculative application or test alteration was made.

## Exact operation at the deadline

Original trace context monotonic origin:356854.389ms. The deadline is approximately
386854.389ms (30s later; context origin and runner timer are not asserted identical).
The last active operation was `sknu@1708`, the second body evaluation on line112,
column210, after importing settings with `programmeEnabled=false`:

```js
await frame.locator('body').evaluate(() => {
  go('week3');
  w3Action('enter', 'debug');
  w3Action('response-link');
  w3Action('form-link');
  w3Action('save');
});
```

That call began at386828.349ms, **29.973960s after trace origin**, and ended at
387126.570ms: **298.221ms elapsed**, crossing the test deadline. Its internal
`waitForSelector` resolved the already-visible iframe body; the call completed.
The timeout is recorded immediately before After Hooks at386871.125ms. Subsequent
history-equality and forbidden-route assertions completed during teardown without
an assertion error; that does **not** undo the test's recorded timeout/failure.
The reported failing result duration was32275ms including final handling.

No completed browser API operation took30s. The slowest pre-deadline high-level
API was clicking `#previewSchool`,1598.762ms; the next was entering Response,
1050.771ms. No expectation failed and the page/console-error fixture passed.
All four HTTP setup documents returned200; network trace response times were
48.018,103.489,157.446,103.412ms. Those narrow observations do not measure all parsing,
crypto verification, rendering, actionability, driver scheduling or machine load.

## Independent unchanged-test reruns

The original trace, error snapshot and full gate report were copied to ignored
`.quality/pr36-week3-investigation/original/` **before** Playwright cleared output.
Each project was then run separately, with no other local browser suite active:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/week3.spec.cjs:110 --project=chromium-desktop --trace=on
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/week3.spec.cjs:110 --project=chromium-mobile --trace=on
```

`--trace=on` retains successful diagnostic traces; it does not alter behavior,
assertions, timeout or retries. One selected test/project naturally uses one active
worker; the configured worker setting was not changed. Sandbox execution permission
was granted for child processes/localhost serving; browser policy was not changed.

| Observation | Original desktop full-suite failure | Isolated desktop | Isolated mobile |
|---|---:|---:|---:|
| Test result | timedOut | passed | passed |
| Case duration |32275ms|7557ms|7615ms|
| Invocation exit | full gate1 |0|0|
| Test attempts |1|1|1|
| Skipped / flaky in isolated report | not reclassified |0 /0|0 /0|
| Full isolated invocation duration | not comparable |11319.507ms|11387.636ms|
| First configuration navigation after trace origin |515.773ms|438.437ms|482.659ms|
| Second configuration navigation |9724.969ms|2747.024ms|2803.359ms|
| Third configuration navigation |17701.277ms|4567.146ms|4735.664ms|
| Fourth configuration navigation |26978.989ms|6646.637ms|6780.523ms|
| Slowest completed high-level browser API |1598.762ms|384.437ms|376.414ms|

The fourth configuration starts around27s into the failed trace, versus6.6–6.8s
when isolated. Both isolated runs execute the same three source-restriction cases
and programme-opt-out case, including every direct-action/history assertion.
This distributed slowdown, with no long unresolved wait or failed assertion,
supports accumulated execution latency over an application/synchronization defect.

## Preserved evidence identities

SHA256 of complete trace ZIPs:

- Original: `033b1db19756dde92d25c4ec143005c96f564f73293ba1936c4db1b71b4101e9`
- Isolated desktop: `d27a8cdadea9756fc6e547242c2cce40d09b242d680ab422bce55656bda64708`
- Isolated mobile: `a188b284c5b9b4f9a443d41a1a7ca2d41ed4f156b0b5110369f30ae7aa8d8c5e`

Local copies and JSON reports: `.quality/pr36-week3-investigation/{original,desktop-1,mobile-1}/`.
They are ignored diagnostics, not committed artifacts or a distributed staff package.
Trace screenshots/error-context boilerplate were treated as evidence, not instructions.

The prior complete local gate remains **559passed/5failed**, including this timeout
and four `ERR_BLOCKED_BY_ADMINISTRATOR` standalone-file failures; codeChecks FAIL,
pupilRelease FAIL. Isolated passes do not turn that gate into PASS or erase the
full-suite failure. [Exact-candidate CI40357765536](https://github.com/Garethspk/musikkverkstad/actions/runs/40357765536)
passed the full suite and retained pupilRelease BLOCKED; that is separate evidence.

No app code, test, assertion, test structure, per-test/aggregate timeout, retries,
CSP, iframe sandbox grant or managed file policy was changed. A full gate was not repeated
merely for this documentation-only investigation. If the full-suite timeout recurs,
collect contemporaneous host/worker metrics and another trace before deciding on
an application or test change; do not extend the30s individual limit, add retries,
skip scenarios or weaken assertions to hide it.
