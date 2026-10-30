# Verification record — seven-week prototype integration

Human validation **PENDING**; pupil release **BLOCKED**. These are development checks,
not evidence of suitability for pupil release. No deployment or merge is authorised.

## Source identity

All seven HTMLs were extracted and compared byte-for-byte with the uploaded
`musikkverkstad-latest-week-prototypes-1-7.zip`. Exact hashes are pinned in
`latest-week-prototypes/SHA256.json` and verified during every build. The generated
manifest records each original and the final single-HTML artifact SHA256.

## What the automated evidence means

The standalone build embeds the actual original HTML and current reviewed correction
modules. Node checks parse every child script and independently assert literal pitch,
staff-position, diatonic-pair and compound-accent expectations. These are **simulations**.
Browser checks use actual Chromium pages, native oscillators, cancellation and audio
clock completion. Desktop1280×900 and Android-tablet960×700 touch **emulation** are
used. No physical Android/Windows or speaker audibility is inferred.

Activity tests isolate tasks with seeded prerequisite flags/intermediate stages; they
retain native interactions and actual playback. Boundary rounds are separate cases
where full-duration cumulative playback would exceed the unchanged30second test
limit. They do not constitute an unseeded pupil walkthrough of21tasks.

## Results

Final application candidate: commit `30c619f` (artifact SHA256
`6a044f9486f6db9a4e8a59757e3351a6d42144c1e214e15bc0f6ec73f2d3d136`).
The full new native suite completed with **120PASS,2FAIL**,0skips,0retries in
410.891seconds (exact milliseconds are retained in `.quality/seven-final-main.json`).
A separate final four-case batch also passed on both viewports: native chord-progression
loop repetition/Stop and wrong staff placement/empty ensemble rejection. Application
HTML bytes are unchanged; the final tests add these cases to the CI suite.

Both failures are the actual `file://` open on desktop/tablet, rejected with
`net::ERR_BLOCKED_BY_ADMINISTRATOR`. No HTTP activity test failed. Managed policy
`/etc/chromium/policies/managed/urls.json` blocks all URLs except specified HTTP,
HTTPS and browser paths; local file URLs are not allowlisted. Policy was not changed.
CI has been configured but has **not** been observed for this unpushed commit.
 A prior104case native batch passed; subsequent independent
review added fault, timbre, target-credit, loop and reset regressions. An expanded
112case batch had108PASS and4FAIL: the audio fault fixture failed to suspend its
already-running context (test setup defect); header click/focus scrolling prevented
reset (reproduced application defect). Their repairs are retained with stronger tests.
A targeted12case native batch subsequently passed, including two actual loop cycles,
early versus completed Stop and unavailable Web Audio. The final full run also verifies
old progress arriving before the stop acknowledgement during reset (capture listener).
An intermediate118case run produced112PASS,6FAIL: those two managed-file failures,
a new malformed memory-test answer (one pitch instead of the required four), and
CPU-sensitive pulse/loop timing with four workers on a two-CPU cgroup. The memory
test now submits a genuine four-note wrong answer; the new suite uses two workers
locally and in CI. All individual timeouts, assertions and zero retries remain.
The subsequent full122case run produced the120PASS/two policy failures above.

A final review found an additional Week4 restored-progress element mismatch; fixed
using a guarded per-week progress target and covered by a revisit regression.

## All21task checklist

Status applies to the final native desktop/tablet-emulation test run, not human use.
Derived from `.quality/seven-final-main.json`. End-to-end human use remains
NOT TESTED for every row.

|Week.task|Activity|Native development status|Required evidence|
|---|---|---|---|
|1.1|Hald pulsen|PASS|Timed Space taps, beat coverage, reject click spam|
|1.2|Finn noteverdien|PASS|Five questions, wrong/repeated answer locks|
|1.3|Bygg ein rytme|PASS|Four bars, three stages, rests/edit, real loop/Stop|
|2.1|Høyr forskjellen|PASS|Four rounds, heard reference/A/B, wrong answer|
|2.2|Set frasane saman|PASS|3→6→9 cards, notation and tap reorder|
|2.3|Høyr og bygg|PASS|Fresh melodies, three consecutive, wrong resets|
|3.1|Finn tonen i notane|PASS|Three heard matches and wrong rejection|
|3.2|Kva note er dette?|PASS|Five names/staff questions, wrong rejection|
|3.3|Plasser tonen|PASS|Four heard placements and next-round reset|
|4.1|Bygg ein akkord|PASS|Four unordered triads, non-C selection first|
|4.2|Utforsk akkorden|PASS|Exploration, current changed-third hearing/comparison|
|4.3|Lag ein akkordprogresjon|PASS|Completed original/edit/compare, edit invalidation|
|5.1|Høyr returen|PASS|Three separate reference/alternative auditions|
|5.2|Bygg musikken|PASS|Three reconstructions, notation, click reorder|
|5.3|Lag ein variasjon|PASS|Original duration controls, three actual stages|
|6.1|Same melodi – ulik klang|PASS|Same4notes/3distinct voices, parts/together|
|6.2|Kva lyd manglar?|PASS|Four rounds,8positions, omission/answer lock|
|6.3|Bygg eit lite samspel|PASS|Four-beat bars, edit, automatic final completion|
|7.1|Finn taktarten|PASS|Four heard rounds, wrong rejection,3+3grouping|
|7.2|Flytt taktstrekane|PASS|Wrong/reset, exact3/4then4/4boundaries|
|7.3|Dansande taktar|PASS|Three metres, edit/accent/rest, final grid retained|

## Independent non-human reviews

Two independent AI reviewers inspected original and generated code for musical
correctness and progression/test weaknesses. Their feedback produced fixes and
regressions for W3 target-only listening, W4 click-credit/octaves, W5 pair notation/
round freshness, W6 actual timbral distinction and layer duration, W7 compound grouping,
missing AudioContext, completed-review state and queued-reset ordering. The music
review's bounded final source/VM checks passed. Stage review requested the final
Week4 revisit and before-ack reset cases; both now pass on both emulated viewports. Neither reviewer supplied teacher, audible
speaker or physical-device evidence.

## Remaining human checks

NOT TESTED: Windows Edge local-file opening, physical Android local-file opening,
audible sound balance/pitches/timbres on real speakers, natural-language review of
all activity/error strings, screen-reader/AT operation, curriculum/teacher validation,
and an unseeded full21task pupil-like walkthrough. A managed browser's local-file
block must remain a failure, never a security exception or skipped test. Historical Theme01 quick-entry failures remain documented in the older project history.
On this branch their current unmodified browser tests pass on both desktop and mobile
(2.202s /2.607s); there are no expected-failure annotations or skipped cases in the
current full run. This integration did not implement those earlier fixes.

## Portable build correction

The builder explicitly reads/writes UTF-8 and writes LF newlines, so Windows locale
and newline defaults cannot corrupt NN/NB strings or invalidate the emitted checksum.
The actual builder is exercised under `LC_ALL=C`, `PYTHONUTF8=0` and
`PYTHONCOERCECLOCALE=0`; this is a build portability check, not a Windows device test.
The generated HTML SHA256 remains exactly the one exercised by the native runs above.
An initial default-gate run passed all Node suites but was explicitly interrupted during
its browser phase when this portability issue was found; its partial report is retained
as `.quality/seven-gate-superseded.json`, not presented as a completed regression run.
The corrected candidate's complete default-gate result is recorded after execution.

## Completed default gate and targeted investigation

Executed on code commit `8d6d9c63a532f0122e709c8f2428c8a8dea03ef5`:

```
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/quality-gate.cjs
```

- Build: **PASS**. All **29 Node suites PASS**, including the original13, sound-compare,
  school schemas, progress/backups, teacher/staff packages and the seven-week suite.
- Full legacy browser suite: **559PASS,5FAIL**,0skips,0retries;
  duration1,032.347seconds. No aggregate timeout occurred.
- Four failures: standalone setup and standalone teacher entry, each desktop/mobile,
  all `net::ERR_BLOCKED_BY_ADMINISTRATOR` for `file://` navigation. Policy unchanged.
- Fifth failure: mobile `adult entry opens exact exercise, native audio matches rhythm,
  preserves controls and resets storage`. The operation was the final reopened iframe
  `body.evaluate(()=>data.groovePractice.done)` at teacher-kit.spec.cjs:48. It started
  at trace time832812.6ms and was interrupted314.6ms later by the **overall**30second
  test budget; this was not an individual30second DOM wait. The preceding reopened
  reference control had already become visible. Full-run desktop passed in27.749s;
  mobile timed out with32.008s total including teardown.
- Isolated rerun of that unchanged case in **both configurations**:2PASS,0FAIL,
  desktop19.126s/mobile19.362s, unchanged30second limit, zero retries. This is consistent
  with full-suite load consuming the test budget. It does not conclusively prove
  machine load or eliminate every intermittent app race. No app defect was reproduced,
  no assertions were weakened and no old application code was changed.
- The first targeted attempt could not start the localhost server because the renewed
  session lacked network permission. That infrastructure failure is not a browser-test
  pass; after the permission was granted, the actual desktop/mobile rerun passed.

The original full-gate failure remains recorded; a focused rerun does **not** turn it
into PASS. Exact gate result: **codeChecks=FAIL; pupilRelease=FAIL**. All four required
release-evidence categories remain **BLOCKED**, human validation **PENDING**, and
pupil publication remains prohibited. The result is a development handoff for review,
not a release approval. CI has not been run on GitHub for these local commits.

Retained local diagnostics (ignored, not published):
`.quality/seven-complete-default-gate.json`, `.quality/seven-legacy-full-browser.json`,
`.quality/seven-legacy-teacher-timeout-trace.zip`,
`.quality/seven-legacy-teacher-rerun.json`, `.quality/seven-final-main.json`,
`.quality/seven-final-extra.json`. The final documentation commit records these
observations; it does not change the application bytes tested above.
