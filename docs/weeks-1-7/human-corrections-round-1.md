# Human testing corrections, Round1 — audit before implementation

Development branch only. No main merge/deployment. Human retesting PENDING;
pupil publication BLOCKED. Supplied seven originals and musical banks stay intact.
The previous pulse correction and its unresolved local fallback observation remain
recorded separately in `pulse-assessment.md`; this round does not silently relabel it.

## Confirmed defects and decisions (pre-code inventory)

- Week3.1/3.3: integration `nextCorrect` requires a `pitch-task-round` key recorded
  only by the main target control. A/B and adaptive/reference-tone controls use plain
  `play` and cannot satisfy that key. A native W3 tone is scheduled at+.08s, ends its
  envelope at+.471s and its oscillator at+.501s, but the first X.play completion
  check is only scheduled at+.56s (clock eligibility+.54s). Starting another fully
  legitimate example after native `ended` can cancel the pending credit during a
  silent tail. This is not evidence that the tester interrupted sounding audio.
  Original prototypes grade pitch/placement directly. Restore that behaviour;
  stop outgoing audio when a correct answer replaces a question, retain3/4counts.
- Week3.2: original quiz has notation and answer choices, but only the conditional
  adaptive hint supplies sound after wrong answers. Add an always-available replay
  immediately after notation and before answers; preserve pitches/staff and5answers.
  Distinguish QuestionN/total from CorrectN/total throughout Week3.
- All seven final-task footer handlers merely show completion text. The integrated
  shell has no next-week request. Add a shared translated next-week action for1–6,
  validating current session/source and complete flags, with the existing stop/ack
  before mounting the next week. Preserve flags and mark complete weeks visibly.
  Week7 reports programme completion only if all21flags are true; otherwise reports
  truthful Week7 completion and actual total, since this trial allows free week choice.
- Additional same-class defects in2.1/2.3/5.1/6.2/7.1: integration injects X.need
  prerequisites absent from their original answer handlers. The same shared delayed
  callback can veto correct content answers after a completed listen. Restore their
  original content-only answer criteria, with existing round/streak/rapid-click locks.
  This changes no musical example or accepted content answer. Listening stays encouraged.
  Creative tasks that intentionally require creating/editing/full playback retain
  those action requirements; no blanket always-true heard flags or gate bypass.
- Week6.2: during the existing700ms question transition, the lock guards answers but
  leaves buttons looking enabled. Visibly disable these until the next question.
- Week7.2: numbered beats and separate handle row obscure the interaction; count-only
  feedback labels too many boundaries as missing. Redesign only this requested task:
  one continuous beat strip with visible44px tap handles directly between beats,
  fixed outer boundaries, explicit3/4and4/4instructions, exact extra/missing/wrong
  feedback, existing12beat accented reference and synchronous visual highlighting.
  Keep all11interior handles reachable by touch/keyboard; scroll hint on narrow screens.
  Reference accents always follow the correct metre, not pupil mistakes. Retain
  correct3/4grid for optional replay before explicit Next4/4; keep final replay and
  unlock Task3 after correct4/4. No mandatory listen or drag, no live announcement
  of every beat. Design inspected independently before coding (AI, not human approval).

## All21 activity audit matrix

|Activity|Source finding / planned action|
|---|---|
|1.1 Pulse|Retain existing correction and documented unresolved fallback; regression only|
|1.2 Values|Five correct answers and rapid-answer guard already present; no grading change|
|1.3 Rhythm|Three action/playback stages and real loop retained; fix shared final navigation|
|2.1 Compare|Remove injected heard-key answer veto; retain four correct content answers|
|2.2 Phrase assembly|3→6→9cards and correct-order check retained|
|2.3 Memory|Three-consecutive melody validation retained; remove key veto and fix final navigation|
|3.1 Pitch match|Remove key veto, retain exact match/three correct, separate question/correct counts|
|3.2 Note name|Add sound next to notation, retain five correct/no mandatory listen|
|3.3 Placement|Remove key veto, retain exact pitch/four correct and reset-before-render|
|4.1 Chords|Any-order exact target triads retained|
|4.2 Chord exploration|Retain meaningful changes/completed playback requirements|
|4.3 Progression|Retain original/edit/compare and playback; shared final navigation|
|5.1 Return|Remove injected key veto; retain three correct phrase matches|
|5.2 Reconstruction|Three correct four-bar orders retained|
|5.3 Variation|Exact duration controls and allthree action/playback stages retained|
|6.1 Timbre|Allthree timbres and parts/together action requirements retained|
|6.2 Missing layer|Remove key veto; retain four correct/answer lock; disable pending buttons|
|6.3 Ensemble|Four-bar build/change/final playback retained; shared final navigation|
|7.1 Metre|Remove injected key veto; retain four correct and3+3compound examples|
|7.2 Barlines|Requested interaction/feedback redesign; exact interior boundary sets retained|
|7.3 Dancing metres|Creation/edit/playback rules retained; truthful programme completion|

This is source inspection, not a claim all21have passed new automated/human testing.
New regression results and remaining limits will be appended after execution.

Additional source-confirmed completion defects found by the independent pre-code
QA audit (recorded before behavioural modification): W1.2 answer controls remain
enabled after completion although their handler silently returns; W1.3 Play is
enabled after completion but `playBars` returns without sound. W2.3 allows editing
and Check after completion but `checkMemory` returns. W3's final correct-answer
handlers can increment past the required count before a rerender disables them.
W5.1 and5.2 retain enabled correct/Check actions that increment beyond3/3. Narrow
fixes: guard completed grading, disable completed assessment inputs, retain replay
where it exists, and permit W1.3 completed-rhythm replay without advancing stages
again. These are completion-control repairs, not new musical activities.

First implementation review found a displayed-note identity edge: replay must
capture the pitch when the notation question renders, since the fifth correct
answer increments its bank counter without replacing that final staff. The old
adaptive-hint panel can also survive a correct transition and dynamically play a
subsequent bank pitch. Repair within this round: capture the replay pitch and clear
stale per-question hints when answering correctly. Native regression will replay
after5/5 and verify the still-displayed MIDI69 instead of the next bank entry.
First native traces also confirmed neighbouring beat elements intercepted the new
barline handles; repair their stacking and spacing before handing off the design.

The same completed-control audit also found that Week2 comparison answers and
phrase-order Check are recreated enabled on completed-task revisits/language
rerenders, while their handlers return. Disable those finished assessment controls
on render, retaining sound and arrangement-practice controls. This is part of the
already documented completed-assessment repair, not a change to musical criteria.

## Focused verification and bounded review results

First native batch:40PASS/8FAIL,0skips/retries. Six barline tests could not click
because the next beat container intercepted its handle; two rhythm replay tests
used a5second polling bound for a declared5.86second audio cycle. The first trace
and helper failure are retained in ignored `.quality/round1-first-*-trace.zip`.
Repairs:72px beat cells with44px unobstructed handles and explicit stacking; wait
for the actual audio cycle within the existing30second test limit. No assertion,
retry count, security restriction or release decision was weakened.

Second native batch: **50PASS**,0FAIL,0skips/retries,164.704seconds. Desktop1280x900
and phone-sized390x844 touch emulation; NN/NB/EN. The final displayed-note replay
regression includes two wrong final answers, hint visibility, correct fifth answer,
hint removal, then actual MIDI69 replay with the unchanged A4 staff position75.
The actual Week2three-consecutive melody test reaches3/3 and navigates to Week3.
Shared navigation tests seed completed flags solely to isolate the footer contract;
they are not an unseeded21-activity pupil walkthrough. Added full-suite assertions
also check next-week label/language preservation and completed barline-stage replay.

The native oscillator-ended race test recorded `{ended:true,receiptAtEnd:false}`
on BOTH viewports: real oscillator lifecycle, with a scripted DOM activation of the
following example at `ended`. This reproduces naturally ended sound without its
pending listening receipt. It is not speaker/hearing or physical-device evidence.
The separate deterministic `tests/round1.cjs` proof is explicitly a clock simulation.

Two independent read-only AI reviewers approved the pre-code educational direction,
found the displayed-note/late-hint identity and handle geometry issues in pass1,
and verified the bounded fixes in pass2. They did not provide human teacher/device
approval. The seven uploaded originals remain checksum-identical; original content
answers and3/5/4correct counts, three-consecutive melody rule and creative action/
whole-playback conditions are retained. All21native checks and default-gate results
will be reported separately after their complete runs.

Second bounded UI repair, after extended keyboard/revisit verification: on a390px
phone viewport the new continuous strip forced its grid panel to942px and the body
to954px, leaving the strip itself unscrollable (clientWidth=scrollWidth=912px).
Constrain the redesigned activity's grid panel minimum width so scrolling remains
inside the beat strip. Keep the44px handles; do not reduce target size or weaken
keyboard/pan assertions. The same completed-assessment audit found Week7metre
choices recreated enabled after completion although their handler returns; disable
those finished answer controls on render while retaining its reference replay.
Both are narrow presentation/state repairs; no additional musical criteria change.

The first complete200case native run on155710e recorded198PASS/2FAIL,
0skips/retries,709.343seconds. Both failures were managed `file://` blocks; every
HTTP activity check passed, including all pulse cases. This does not erase the
previously recorded fallback-clock inconsistency or provide physical-device proof.
The additional metadata/keyboard batch then recorded11PASS/1FAIL: its failing
phone scroll assertion led to the measured panel-width repair documented above.
The repaired additional batch recorded **14PASS**,0FAIL,20.6seconds. It verifies
correct content answers without receipts in the other five affected drills, real
keyboard toggle/pan preservation and completed metre-answer state. W3matching/
placement were already checked with absent receipts in the focused50case batch.
The final full run includes all214cases against the final responsive build.


## Final complete verification

Tested code commit: `eb9a0c451ea5754fd412fefaf296cce1a01ceec3`, with a clean
working tree throughout both final runs. Subsequent result/checklist documentation
is not a new application build and is not represented as the same content hash.

|Check|Exact result|
|---|---|
|Final seven-week native browser suite|214 cases: **212 PASS / 2 FAIL**, 0 skips, 0 retries, 716.384 seconds|
|Default gate build|PASS|
|Default gate Node regressions|All **31 suites PASS**, including sound-compare, pulse, round1, school, backups, staff-review and seven-weeks|
|Default gate legacy browser suite|564 cases: **560 PASS / 4 FAIL**, 0 skips, 0 retries, 993.817 seconds|
|Default gate process|Exit **1**; `codeChecks=FAIL`, `pupilRelease=FAIL`; all four required-evidence fields remain `BLOCKED`|

The two seven-week failures are direct standalone HTML navigation on desktop and
mobile. The four legacy failures are standalone setup and adult teacher entry on
both viewports. All six report `page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR`
before app execution. The managed Chromium URL policy blocks all URLs except its
allowlist, which includes HTTP/HTTPS but not `file://`. This documents a local
policy limitation, not a successful standalone-file check. Every assertion and
security restriction remains enabled; no skips, retries or timeout changes.
No mobile teacher-kit timeout or pulse fallback discrepancy occurred in these
final runs. Historical failures remain recorded, not retroactively passed.

Reproduction commands (installed system Chromium selected explicitly):

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test -c playwright.seven.config.cjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/quality-gate.cjs
```

Ignored local evidence: `.quality/round1-final-seven-full.json`,
`.quality/round1-final-seven-full.log`, `.quality/round1-default-gate.json`,
`.quality/round1-default-browser.json`, `.quality/round1-default-gate.log`.
The default gate's recorded content hash is
`c98085c22255d06a629e1417973dc652cfdcd1bb4686417ff39c82b53de21195`.
This is local Chromium evidence; no new GitHub Actions result is claimed. The
existing PR36 is closed/merged; this development-branch push alone does not match
its main-only push workflow trigger. No merge or deployment is performed.

## Staff preview handoff

The standalone [HTML on the development branch](https://github.com/Garethspk/musikkverkstad/blob/issue-35-private-staff-review/staff-preview/musikkverkstad.html)
is the exact tested generated file. Use GitHub's **Download raw file** button,
then open the downloaded HTML in Microsoft Edge. Do not open a stale older copy.
This is a repository artifact for staff retesting, not a deployed site or pupil
release. The repository is public, as previously authorised by the owner; the
branch name does not provide private access control.

SHA-256:

```text
34c55ef0611bca570c5712faeb529d012e4d9e95ce375f7fc4b76489f0918f25
```

All seven uploaded prototype checksums still match their original pins. Their
source bytes are unchanged; scoped corrections live in the integration modules.
Human retesting and required release evidence remain PENDING; pupil release
**BLOCKED**. No release decision or prototype security boundary was weakened.

## Final integrated activity checklist (2026-11-03)

`PASS` below means the stated automated HTTP Chromium regression passed on both
configured desktop and mobile-emulation projects against code commit
`eb9a0c451ea5754fd412fefaf296cce1a01ceec3`. It does not mean teacher approval,
audible speaker verification, physical-device testing, or an uninterrupted pupil
walkthrough. Tests deliberately seed earlier completion flags to reach individual
activities; several long creative activities also seed the stage under test before
exercising real controls and native audio. Shared footer tests use explicitly
labelled completion fixtures. All human retesting remains **PENDING**.

|Activity|Desktop/mobile automated result|What the regression actually verifies|
|---|---|---|
|1.1 Pulse|PASS / PASS|Three repetitions, real scheduled input, steady/delayed/irregular cases, repeated attempts and unlock; output-clock fallback included|
|1.2 Values|PASS / PASS|Five note/rest questions, wrong-answer rejection, rapid-answer lock and completion|
|1.3 Rhythm|PASS / PASS|Each staged rhythm with real playback/edit/rest conditions; loop/stop credit and completed replay without advancing again|
|2.1 Compare|PASS / PASS|Four round boundaries, reference/A/B playback, wrong rejection and correct grading without listening metadata|
|2.2 Phrase assembly|PASS / PASS|3/6/9-card stages, actual reorder controls, wrong check, completed-state controls|
|2.3 Memory|PASS / PASS|Three consecutive correct melodies, wrong answer resets streak, fresh targets, actual third success and next-week transition|
|3.1 Pitch match|PASS / PASS|Three correct matches, full/different-order/repeated playback, native-ended receipt race, absent receipts and visible Task2 unlock|
|3.2 Note name|PASS / PASS|Five staff/name mappings, replay below notation before answers, repeated replay, final displayed MIDI 69, stale hint removal and count labels|
|3.3 Placement|PASS / PASS|Four exact pitch placements, wrong rejection, next-question reset, absent receipts and completed count guard|
|4.1 Chords|PASS / PASS|Four unordered target triads, non-root-first input and wrong formed-chord rejection|
|4.2 Chord exploration|PASS / PASS|Each seeded phase, meaningful alterations, actual changed/target playback and retained comparison|
|4.3 Progression|PASS / PASS|Each seeded phase, original/edit/compare playback, edited-credit invalidation, native second loop and Stop cancellation|
|5.1 Return|PASS / PASS|Each round's original/alternative, wrong phrase rejection, correct match without receipts and completed count guard|
|5.2 Reconstruction|PASS / PASS|Three four-bar orders using click controls, wrong check, completed count guard|
|5.3 Variation|PASS / PASS|Each seeded stage's pitch/duration/rest controls and full playback of the current revision|
|6.1 Timbre|PASS / PASS|Three distinct native oscillator types, same pitches, stopped-playback rejection, separate parts and together completion|
|6.2 Missing layer|PASS / PASS|Each round's omission and eight positions, correct grading without receipts, wrong rejection and rapid-answer lock|
|6.3 Ensemble|PASS / PASS|Each seeded four-bar stage, required revision, empty-plan rejection, stopped-playback rejection and final automatic completion|
|7.1 Metre|PASS / PASS|Four round boundaries, compound 3+3 reference, wrong rejection, grading without receipts and completed rerender controls|
|7.2 Barlines|PASS / PASS|All three languages, exact 3/4 and 4/4 sets, too many/few/wrong-position feedback, correct reference accents, replay, keyboard/touch and contained phone scrolling|
|7.3 Dancing metres|PASS / PASS|Each seeded stage's metre/edit/accent/rest/playback conditions and retained final plan|

Shared coverage passes for all seven weeks: NN/NB/EN, initial locks, one isolated
activity frame, no external requests, keyboard/touch navigation and audio
cancellation. Weeks 1–6 next-week controls, flag retention and Week 7 truthful partial
versus all 21completion pass. The complete all 21programme-completion assertion uses
a fixture, not 21 consecutive human-performed activities. Completion flags survive
navigation only within the open tab; unfinished drafts/rounds are not saved.

**NOT TESTED:** human teacher/pupil usability, hearing correctness through speakers,
Windows Edge, physical phones/tablets, assistive technology and physical latency.
**FAIL:** direct local-file opening in this managed Chromium environment, on both
projects, before application execution (`ERR_BLOCKED_BY_ADMINISTRATOR`). The
policy allows HTTP/HTTPS and blocks `file://`; no bypass or skip was added.
Offline-after-HTTP-load coverage passes but does not replace the failed direct-file
check. The previously documented intermittent pulse fallback result remains in
`pulse-assessment.md`; its cases passed in both full Round1 runs, which is not proof
of all-device stability.
