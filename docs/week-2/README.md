# Week 2 — shape, movement and practising (Issue #25)

Implementation from consolidated main `ae03deb` (PR24 integration plus PR20 curriculum).
Week 2 is the second increment of the existing weekly programme, not a separate app.
Only Weeks 1–2 are implemented. Human music, translation, teacher-adoption TA1–TA5,
real assistive-technology, physical-device and pupil validation are **PENDING**.
Pupil release remains **BLOCKED**; technical failures remain FAIL. No distribution.

## Design reviewed before coding

Four separate non-human agents challenged the design from music, curriculum,
inclusive/game and QA perspectives before implementation. These are AI critiques,
not human specialists, teacher interviews or observed learning. See [review record](reviews.md).

All three slots are visible and independently accessible, with no compulsory Week 1,
audio, sequence, calendar lock or mastery prerequisite. Suggest one decision or revision
in 3–5 minutes, then stop even with an unanswered question. No speed/streak reward.

| Slot | Musical purpose and mechanic | Valid evidence and limits |
| --- | --- | --- |
| Form detective | Locate exact repetition or the specific offered opposing A/B contrast in curated musical maps. Inspect actual notes, not letters alone. Select all maps meeting the brief, including related-variation distractors. | Visual/text relation reasoning, not auditory form recognition. Existing Form palette/renderers are reused; same family does not imply identical music. |
| Melody contour | Compare original short pitched event sequences on one fixed C4–A4 axis, select all meeting an explicit direction definition. Include steps, leaps, held/repeated pitches, arches, valleys and returning shapes. | Strict rising means **every** adjacent pitch increases; falling decreases; level stays equal; mixed means none of those, including motion combined with a repeated note. Endpoint rise alone is insufficient. Diagrams connect discrete notes, not glissandos; text includes octave/duration. No hearing or performance assessment. |
| Practice-plan challenge | Read a short instrument-neutral situation, choose a defensible strategy, inspect its conditional consequence, keep a before-choice and revise/save a plan. | Plans record a choice, not successful practice or a universally correct strategy. Alternatives remain available. Transfer to an instrument is private and unassessed. No right/wrong or completion score. |

See [worked musical examples](worked-examples.md). Exact curated cases, original note events, prompts, branch consequences and versioned
IDs live in `src/week2-core.js`; NN/NB/EN interface copy is in `src/week2.js`.
Content is built-in reviewed code/data, never executable imported curriculum JSON.
At least eight structurally distinct cases per objective mechanic precede expansion.
The bank must vary musical structure, question window, interval/duration or internal
movement; transposition, option rotation and renamed IDs do not count as new content.

Four pupil-chosen configurations change comparison demand or choice of brief;
they do not assign ability, add speed pressure, force a level change or merely make
prose longer. Existing studio design, native keyboard/touch buttons, selected state,
focus restoration and text equivalents are retained. All new tasks work without
initialising audio or requesting samples. Existing sound transport remains unchanged.

## School restrictions and Form reuse

School schema **6 is unchanged**. `programmeEnabled` and `levels.programme` govern
both implemented weeks; the setup label now accurately describes Weeks 1–2.
`week2` maps explicitly to the existing programme guard and levels for cards,
restored routes, Continue, direct handlers and archive reopening. No added admin work.

Form detective additionally requires Form enabled with a repeat/contrast-capable
Form configuration (1 or 4). If those are absent, its entrance remains identifiable
with an unavailable explanation; the other two Week 2 activities remain free.
The scoped Formverkstad link chooses an enabled 1/4 configuration and the actual
repeat/contrast brief. It never forces configuration 2/3 into another musical task,
alters school settings or pupil progress, or bypasses a disabled Form activity.
A contextual return brings the learner back to Week 2. Form's established musical
predicates/data remain intact; the Week 2 curated comparison bank is additional.

The adult teacher kit remains restricted to Theme 02: programme disabled means
both weeks are denied. Preview stays opaque `allow-scripts` only. The actual exported
pupil files use the same compiled content and restrictions; no administrator interface,
external service, account, analytics, microphone or extra publishing privilege is added.

## Progress and compatibility

`week2Practice` is a separate optional version-1 extension of the existing local
pupil record/backup. Settings contain no pupil data. Content slot/type/challenge/
revision/configuration identities distinguish the new records from Week 1 and Form.
Completed objective comparisons may record practice, never mastery. Scenario choices
are explicit ungraded saves, with before/current choices; no scenario correctness score.
Unfinished objective answers are not promised across reload. Continue remembers only
route/task/configuration; it does not silently restore an unfinished answer.

- Missing `week2Practice` in an older backup preserves current Week 2 independently
  of the other optional extensions. Missing Week 1/Theme 02/Form/Conversation also
  retains that module's newer records. An old backup must not erase Theme 02 rhythms.
- An explicit valid Week 2 field, including empty, replaces Week 2 after the existing
  confirmation. Cancel changes nothing. All fields validate before any mutation;
  any malformed sibling aborts the whole import.
- Unknown, malformed, out-of-range or duplicate plan records are rejected. Validated
  data must not alias imported objects. Corrupt raw storage is protected from writes;
  denied/quota storage allows in-memory practice/export, without false saved claims.
- Language/branding/settings updates retain valid archives. Disabled histories remain
  exportable but reopening obeys current restrictions; settings cannot grant content
  that is unavailable in the application registry.

Native tests and Node simulations are reported separately. Native desktop/mobile
means Chromium viewports, not physical devices or Windows Edge/speaker validation.
The unchanged development gate/workflow discovers the new suites. Exact candidate
results and any managed standalone-file policy failures are recorded in the draft PR.

## Week 3 follow-up — PROPOSED, not implemented

After separate review of Week 2, author and review a Week 3 increment:

1. **Melody response:** scoped reviewed retain-and-change brief into existing Theme 03,
   preserving school restrictions and its one audio engine. Keep exact musical examples,
   multiple valid responses and optional narrow Echo distinct.
2. **Notation debugging:** inspect/repair a 4/4 measure; display explicit event durations
   and total beats. Enumerate every valid repair for the brief, including alternatives.
   Author at least eight genuinely different vetted cases before expansion; no speed quiz.
3. **Form construction:** scoped ABA/BAB return using existing Formverkstad. Both valid
   maps remain accepted; respect enabled Form configurations and retain saved versions.

Acceptance before implementation: four critical AI lenses, actual note/brief/answer
consistency and independent finite oracles; NN/NB/EN; independent short entry points;
keyboard/touch/text equivalents; atomic backup/restriction regression tests; real browser
preview/extracted ZIP/offline checks; full gate; human validation still PENDING.
No Week 3 route, enabled manifest entry, activity shell, prompt bank or completion claim
is introduced by Issue #25.
