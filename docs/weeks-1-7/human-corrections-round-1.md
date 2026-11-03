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
