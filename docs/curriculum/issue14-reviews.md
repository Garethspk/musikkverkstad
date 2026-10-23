> Historical PR15 musical/source review. It does not supply exact-candidate
> approval for the integration; see the [new independent integration reviews](../integration-18/reviews.md).

# Issue #14 — independent review lenses and scoped decisions

**Initial review record · 22 October 2026 · implementation prototype.** This is not a human specialist endorsement, teacher adoption decision or pupil-release approval. The explicit development authorisation is [Issue #14](https://github.com/Garethspk/musikkverkstad/issues/14). Pupil release remains **BLOCKED** when development checks pass; actual failed checks remain **FAIL**. Teacher adoption, human musical/listening review and pupil/device/accessibility evidence remain **PENDING**.

Reference: [implementation contract](../theme-03.md), [adjudicated musical examples](theme03-adjudication.md), [quality/review rubric](quality-review.md). Four separate non-human lenses must complete their first reports independently before synthesis. Agreement between model roles does not constitute independent human expertise or empirical validation.

## Review status and limits

| Lens | Initial status | Actual material reviewed | Limits |
| --- | --- | --- | --- |
| Curriculum planner | First report complete; source-level follow-up recorded below. | Issue #14, decision memo, framework, activity template, quality criteria, Theme 03 adjudication; current `src/conversation.js`. | Non-human; no teacher/pupil observation, physical device or audible listening review. |
| Theory/composition checker | Independent first report and finite-oracle test authoring complete. | Issue, adjudication, frozen matrix, source and new Node suite. | Non-human; Node simulations, no listening or human judgement. |
| Game/inclusive interaction | First and bounded second source passes complete. | Framework and actual component/focus/draft paths. | Source review only; browser checks are separate evidence. |
| QA/evidence | First and bounded second source passes complete. | Extraction diff, schemas, source, malformed-metadata VM reproduction. | Not human, perceptual, device or speaker verification. |

## Independent curriculum-planner report — before synthesis

The experience is coherent when its purpose is “hear a short call, preserve a clearly identified anchor, change a specified feature, listen and revise.” Optional Echo prepares precise listening but must not define musical conversation. Listening should compare a taught relation, construction should make a response under a declared brief, and creation should allow alternatives and revision without aesthetic judgement.

Initial planning caution: retain/change can preserve pitches **or** rhythm, but the pupil must be told which. The frozen configuration 3 is strictly descending melody with the rhythm retained; it is not an opening-pitch-retention task. Configuration 4 increases agency by letting the pupil choose an existing brief rather than adding speed or longer memory. These are meaningful differences in musical decisions, but not a measured ascending ability ladder.

The initial report recommended one-note variation, broader two-note ending choice, specified opening/ending and selected-brief agency while holding bar length, timing and controls stable. It warned against manufacturing four levels of identical Echo by merely increasing length. The source-level follow-up found that the four configurations now use this bounded material rather than PR #9's 2/4/4/6-event ladder. Optional whole-call Echo is the same narrow relation across those positions; it must not be marketed as four distinct Echo difficulties.

### Musical acceptance criteria from this lens

1. Every locale identifies the retained anchor, editable feature, duration and endpoint before marking. No undisclosed rhythm/phrase constraint appears after an answer.
2. All structurally valid offered responses and piece orders are accepted. The source's current accepted listening sets are: change-last **B,C**; keep-opening/end-C **A,B**; descend **A,B**; whole-call Echo **A**. The current accepted construction orders are: change-last **1→2, 1→3**; keep-opening/end-C **1→2**; descend **1→2, 3→2**. An independent theory/test lens must verify these rather than treating the planner's reading as the final oracle.
3. Feedback locates the heard feature and permits retry. An echo failing a change brief remains a possible musical reply; a changed reply failing an Echo brief is not “bad music.” Named C4 is an objective endpoint, not a universal aesthetic law.
4. Creation permits several replies, including an unchanged echo or an exploration outside the displayed suggestion. No automatic intention or creativity judgement. All four pitches being editable is stated honestly; the app does not claim to protect an anchor that it leaves editable.
5. Actual sampled playback and the written event/answer contract agree. Four quarter notes at 90 BPM and one unassessed call/reply gap must not inherit PR #9's tempo or final-motif semantics.
6. The default teacher recommendation is **one exercise in 3–5 minutes**, not compulsory completion of all three entrances. Creation is immediately available; listening/building are alternative useful routes. The pupil may stop with uncertainty, without a correct mark or saved object.
7. A voice/instrument attempt can test transfer of the relevant relationship, but rhythm-only tapping cannot verify retained melody. No microphone or performance grading is implied.
8. Practice counts and saved creations are not mastery certificates. Existing work, language preferences and valid backups/settings must not be erased when this content is added or restricted.

### Source-level concerns to adjudicate

The activity template calls for a sounded demonstration on a separate example and a sounded hint before a full event solution. The first source pass supplied rule, options/pieces, replay and feature-specific text only. A separate sounded model was then added: call D4–E4–G4–A4, followed after one unassessed beat by a reply satisfying the current brief. It gives no current-question listening credit. Human review of its independent usability remains pending; replay is not evidence of comprehension.

Listening checks require the call and all three replies to finish before marking. This may encourage audition but cannot establish attention or hearing. Teacher/pupil observation should check whether this gate assists independent comparison or becomes repetitive friction; it must not be described as demonstrated listening comprehension.

The creation mode remains narrower than adjudicated example 10: pitch-only editing of four quarter notes and before/current audition. That is acceptable bounded scope if documented. No unsupported claim of rhythm invention, anticipation or general response-making mastery follows.

### Planner disposition and verification limits

**GO for the explicitly authorised bounded development**, subject to independently checked event rules, working integration and honest limitations. **HOLD** additional activities, full-year rollout, human teacher-adoption claims and pupil release. Issue #14 authorises implementation while human evidence remains pending; it does not authorise inventing that evidence or changing release gates.

This role reviewed documents and source, not a finished rendered interaction, actual speaker playback, teacher recommendation behavior or pupil learning. Its first report preceded the other role findings; no final four-lens consensus is asserted by this entry.

## Disagreement and synthesis log — author to complete

| ID | Finding / tension | Proposed disposition | Status / owner |
| --- | --- | --- | --- |
| C1 | Planner proposed two ending-shaping configurations; composition also offered a retained-ending alternative. Four configurations must differ musically. | Author chose reviewed example 5 for configuration 3: retain rhythm, change to strict descent. This adds a distinct heard relation while keeping bar/pool/controls stable; theory reviewer checked exact permutations. Level 4 adds agency, not proven difficulty. | Resolved for bounded development; human differentiation review PENDING. |
| C2 | Template requests a separate sounded demonstration. First source lacked it. | Added a different-call worked model, with explicit purpose, no current-answer credit and native pitch/timing regression. Replay and feature text remain available. | Implemented; human usefulness PENDING. |
| C3 | A coherent loop could be misconstrued as requiring three entrances within five minutes. | Recommend one exercise with an optional next action; no compulsory tour, score or save. Change generic “two endings” to “two replies” for the contour task. | Resolved in source/docs; actual teacher recommendation friction PENDING. |
| C4 | An implementation task now exists while earlier planning documents described additional human pre-code gates. | Follow explicit Issue #14 authorisation, preserving actual human/adoption/release evidence as PENDING/BLOCKED. | Scope interpretation; no fabricated approval. |

Record the other independent first reports before synthesis. For every material disagreement, retain the objection, concrete evidence, chosen response, remaining limitation and recheck result. Use at most two repair/review iterations per batch; unresolved critical findings stay on hold rather than being averaged into a pass. Human musical review, teacher adoption, pupil/device/accessibility observation, development test success and pupil-release eligibility remain separately recorded decisions.

## Independent theory/composition report — before synthesis

The checker accepted the frozen one-bar matrix conditionally on exact contracts:
change-last preserves three pitches and all durations; opening/end-C preserves two
pitches and names C rather than claiming universal closure; strict descent excludes
repeated pitches; chosen-brief uses the same predicate. All offered valid replies
must be accepted. The specific end-C piece bank has only one valid construction;
that does not make the general musical relation unique. Optional Echo repeats the
whole call, unlike PR #9's final-motif task, and cannot certify conversation skill.

The checker independently enumerated 625 four-pitch strings: 4 change-last replies,
5 opening/end-C replies, 5 strict descents and 1 exact echo. All six ordered
2-of-3 fragment arrangements were checked: change-last 1→2/1→3; end-C 1→2;
descent 1→2/3→2. A–G + G–E fails because equal G is not descent. Rest, bad length,
foreign pitch and non-quarter durations do not meet a four-sounding-quarter brief.
Creation remains ungraded even outside its suggestion. These explicit oracles
became Node tests; the test author labels their DOM/audio harness as simulated.
The checker did not hear speakers, inspect pupils or supply teacher approval.

## Independent game/inclusive-interaction report — before synthesis

The first report required one optional 3–5-minute exercise rather than a compulsory
three-mode course, direct creation, free enabled levels, sounded pieces, undo/trial
audition, explicit revision, non-aesthetic feedback and narrow optional Echo. The
first source review found a keyboard blocker: DOM redraw disabled the initiating
Play or Add control and lost focus. The repair moves focus to Stop during playback,
returns it to the initiating audition afterward and supplies Remove last after Add.
Real keyboard tests cover these paths separately from source review.

The second/final source pass found that blocker repaired and no remaining source
blocker in its scope. It confirmed creation-only draft stashing, separate sounded
model and “two replies” wording. It retained a mobile text-density/usability
question: viewport/keyboard automation cannot establish independent pupil ease.
No actual pupil, teacher, physical-device or perceptual validation was claimed.

## Independent QA/evidence report — before synthesis

Initial extraction review required explicit schema-1 migration, missing-backup
preservation, separation of legacy Echo from new counts, native evidence and
teacher-kit restrictions despite shared runtime bytes. The source pass reproduced
accepted level-1/home metadata reopening as ending in a VM; the fix rejects
inconsistent level/brief metadata before import. It also found property-order
sensitive duplicate detection and legacy audition changing 108 to 90 BPM. Repairs
use canonical event signatures and preserve historical 108-BPM playback. Regressions
cover reordered imports, invalid metadata and old archives.

The musical-test author additionally exposed a saved custom call being overwritten
by listening-mode stashing. Stashing is now creation-only and preserves call,
response and before-version. Tests retain the failing scenario rather than weakening
it. The QA second/final source pass reran malformed-metadata rejection, inspected
all repairs and reported no remaining critical source blocker. It did not rerun the
full pending gate or equate inspection with browser/speaker evidence.

## Technical findings and bounded recheck record

| Finding | Repair / regression | Disposition |
| --- | --- | --- |
| Play/Add redraw loses keyboard focus. | Explicit Stop/return/edit focus destinations; native keyboard assertions. | Source second pass cleared; browser result recorded in PR. |
| Saved level/brief metadata can silently change. | Reject inconsistent level 1–3 briefs atomically. | VM reproduced before; rejection verified afterward. |
| Same musical data with reordered JSON duplicates. | Canonical call/response/before signatures. | Exact reordered-import/save regression. |
| Legacy Echo tempo changed. | Optional playback BPM, legacy 108; new slice 90. | Scheduling regression and explicit archived-work wording. |
| Listening can overwrite custom creation call. | Only creation stashes drafts; include actual call. | Regression preserves D–E–G–A across modes/levels. |

The initial test-writing batch corrected one fixture mistake (checking listening
text while still in building); its second run exposed the real custom-call defect
and stopped. The bounded repair batch fixes that source defect and runs the full
candidate gate. No indefinite repair loop or hidden expected-failure conversion is
used. The two source-review passes are complete; any unresolved critical outcome
from final checks must remain a hold, not a release.

The author selects this bounded implementation for draft review, not pupil release.
The four roles worked independently before this synthesis; their findings were
combined only afterward. Actual results and exact commit/CI identity are recorded
in the draft PR. Human musical review, teacher adoption TA1–TA5, physical
speaker/device/accessibility and pupil evidence remain **PENDING**.

### Full-gate fixture correction

The first complete run passed all 18 Node suites and 156 browser cases; four
standalone-file cases were refused by managed URL policy. Two further failures
were one old school-form fixture in the two viewport profiles: it intended to
select only Theme 02 but unchecked only Theme 01 after a new default theme was
added. The fix explicitly unchecks Theme 03 too, retaining the exact groove-only
assertion. No application setting or test assertion was relaxed. The final bounded
full-gate run verifies this correction and new extracted-ZIP Theme 03 use.

### Final local result and CI suite budget

The second full local run passed build, all 18 Node suites and 158 browser cases;
only the four unchanged managed `file://` refusals remained (no skips, expected
failures or flaky cases). The gate correctly returned FAIL, not PASS. The same
cases remain enabled for the matched GitHub Actions browser.

Measured browser case durations totalled 713.7 seconds on four local workers.
CI uses two workers, making the previous 300-second whole-suite subprocess budget
insufficient even before overhead. The suite budget is increased to 600 seconds;
individual 30-second test timeouts, assertions, no-retry policy, CI job bound and
all FAIL/BLOCKED decisions are unchanged. This accommodates additional real-audio
coverage rather than ignoring or retrying failures. Quality-gate regression suites
are rerun, and CI verifies the exact final candidate.
