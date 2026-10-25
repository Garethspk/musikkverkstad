Issue29 update: [Week4 implementation](../week-4/README.md) develops return-path
mapping, expressive-plan revision and variable-duration rhythmic making. Weeks1–4
only; Week5/6 remain proposals. Earlier Week4-future notes are historical. Human
validation PENDING; pupil release BLOCKED.

Issue27 update: [Week3 implementation contract](../week-3/README.md) develops the
three Week3 backlog slots on consolidated main. Weeks1–3 only; Week4 remains
proposed. Older Week3-future notes below are historical. Human PENDING/release BLOCKED.

Current implementation update (Issue #25): consolidated main includes Theme03 and
Week1. This branch implements [Week2](../week-2/README.md); Week3 below remains a
proposal only. Historical PR15 references below are provenance, not current
unavailability. Human validation PENDING and pupil release BLOCKED.

# Six-week implementation backlog — 18 separately playable slots

**Design backlog, not implemented content.** Each row is an independently accessible optional 3–5 minute experience, with a single meaningful stop after one decision, construction or revision. Multiple valid musical constructions must all be accepted; open interpretation/creation is ungraded. Labels and examples need human music/teacher review, exact NN/NB/EN authoring and accessible keyboard/touch. Current implementation: Formverkstad/Theme02 on main; Theme03 on draft PR15; remaining games proposed.

| Week | Type | Exact worked prompt / rule / feedback basis | Medium |
|---|---|---|---|
| 1 | R1 Pulse detective | Mark beats 1–4 below four equal boxes, with attack marks on beats 1 and 3; accept exactly ordered beats 1,2,3,4. Wrong: treat rests as missing beats. | visual pulse |
| 1 | N2 Symbol mechanic | Given 4/4 and four quarter-beat positions, select quarter rest (not half rest) for exactly one empty beat. | notation/text |
| 1 | C4 Constraint composer | Create any four-cell rhythm containing at least one rest; play/tap or describe, save or revise; no taste grading. | creative |
| 2 | C1 Form explorer | Choose all literal repeats among AA, AB, BB: AA and BB. Contrast AB is not repetition. | visual |
| 2 | M1 Contour map | On a shared staff/grid, compare C4-D4-E4-G4 with G4-E4-D4-C4; one rises, one falls. Same vertical scale. | visual/notation |
| 2 | I3 Practice planner | Choose a tiny goal after a missed beat: tap slow pulse, isolate bar, repeat once; discuss why speed-up is not always helpful. Multiple defensible plans. | text scenario |
| 3 | M2 Melody response | Call C4-D4-E4-G4 quarter notes: keep first 3, change final; C4-D4-E4-A4 and C4-D4-E4-C4 valid; echo not valid under this brief. PR15 draft, not main. | audio/creative |
| 3 | N3 Notation debugger | 4/4 bar has quarter + half + half = 5 beats; repair by changing final half to quarter (or another separately enumerated valid correction). | notation |
| 3 | C2 Form arranger | Build ABA or BAB from A/B cards; AAA misses contrast, ABB misses return; both ABA and BAB accepted. | visual |
| 4 | C1 Form explorer | Select ABA/BAB as literal returns, not ABB/AAA under contrast requirement. | visual |
| 4 | E1 Dynamics storyboard | Place p then crescendo then f over three phrases; allow visual alternate expressive storyboards without claiming one best interpretation. | image/text |
| 4 | R2 Rhythm tile builder | Arrange four one-beat slots as note-rest-note-note in 4/4; accepted event placement exact for that particular brief; other creative rhythms may also work. | visual |
| 5 | C3 Motif transformation | A=C4-D4-E4-G4, A′=C4-D4-E4-A4: identify retained 3-note opening and changed last pitch; alternatives may change rhythm instead in later cases. | visual/creative |
| 5 | N1 Staff landmarks | On a clearly specified treble clef, middle C4 ledger below staff, G4 second line; locate C4 and G4, no time pressure. | notation |
| 5 | I2 Ensemble roles | Short quartet scenario: choose pulse keeper, melody player and contrasting answering part; several workable instrument allocations, explain constraints. | text/visual |
| 6 | R3 Groove repair | Four beat reference sounding on beats 1,3,4 with rest beat2; answer choose/repair beat2 as rest, note all answers tested against actual Theme02 generator. | audio/visual |
| 6 | C2 Form arranger | Build A-A′ under changed-ending prompt; A-B contrasts but does not keep first three notes; or build ABA if repeat/return option selected. | visual |
| 6 | E3 Interpretation scenario | Present same short four-note phrase as gentle and decisive using textual dynamic/articulation cues; pupil compares consequences, chooses a purpose, no taste score. | text |

## Production order and dependencies

**Stage A, reusable scaffolds:** preserve existing Form cards/rules and Theme02 sound engine; add neutral symbol/beat-grid renderer and generic select-all/slot mechanics. For every objective case produce authored instruction, canonical event array, event-derived accepted set, independent predicate/counterexample tests, alternative feedback, semantic NN/NB/EN and accessible text equivalent. Do not make Form or Theme03 available where settings deny access. Clarify Theme03 PR15 is unmerged before dependency work.

**Stage B, first three weeks:** curate 9 specific exercises above. For the quarter-rest task, ensure displayed beat positions and note-length conventions match exact allowed symbols. For staff tasks supply correct clef and octave; do not assume all instruments use treble clef. Ensure creative work can be completed with no microphone. Supply a real recommendation such as 'Week 2 → Form explorer, identify the repeat; stop after one compare.'

**Stage C, weeks four to six:** remaining nine exercises, adding expressive text/graphic scenarios with optional instrument transfer. Generate answer cases exhaustively where discrete, and avoid treating an interpretation as universally correct. Do not imply that a tap response was assessed where no sensor exists.

## Acceptance criteria per slot

1. 3–5-minute independent optional task with a clear goal and stop point; no compulsory three-task sequence or speed pressure.
2. Exact data and correctness rules where objective; all permutations/multiple valid results enumerated by an independent method. A deliberately incorrect distractor is wrong *for the stated brief*, not 'bad music'.
3. Minimum of one counterexample, one hint/feedback response, two different musical content candidates (not cosmetically renamed), and review of repetitions/ambiguity before any scaled bank. Expanded candidate pools remain future work.
4. Three-language parity (NN/NB/EN), keyboard/touch accessibility, text alternative to diagram and no colour-only indication. For text-based work, avoid excessive reading as hidden musical difficulty.
5. Links to genuine instrument/ensemble/musical transfer when useful, without claiming to assess unobserved performance.
6. Exact-commit build, Node predicate tests, rendered browser interaction, actual audio checks where present, school restrictions/migration/backups and no data collection. Teacher-kit remains Theme02-only until separately reviewed.
7. Source/license and human expert validation status recorded; unresolved objections remain visible. TA1–TA5 human teacher-adoption PENDING, device/pupil PENDING, pupil release BLOCKED.

## Reusable content data contract (proposal)

`{id,week,activityType,localeTexts,objective,medium,visualEventsOrSoundEvents,brief,answerPredicate,explicitAcceptedAlternatives,feedback,offScreenTransfer,schoolLevelOptions,license,designReviewStatus,implementationRef,releaseGate}`. Never execute predicates from untrusted content JSON; implement typed, reviewed validators. Version stored content separately from pupil progress; no auto-publish on manifest existence.
