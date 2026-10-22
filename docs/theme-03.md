# Theme 03 — bounded retain-and-change implementation contract

**Issue #14 · development prototype · 22 October 2026.** This is a source-level description of the small implementation on this branch, not proof of learning, teacher endorsement, speaker output or pupil readiness. Pupil release remains **BLOCKED** when development checks pass; failed development checks remain **FAIL**. Teacher adoption, independent human musical/listening review and pupil/device/accessibility evidence remain **PENDING**.

Design authority: [activity template](curriculum/activity-template.md), [common musical-quality criteria](curriculum/quality-review.md), [year framework](curriculum/year-framework.md) and [Theme 03 adjudication](curriculum/theme03-adjudication.md). The explicit implementation authorisation is [Issue #14](https://github.com/Garethspk/musikkverkstad/issues/14); it does not turn missing human evidence into approval. Four non-human review lenses and remaining disagreements are recorded in [the scoped review log](curriculum/issue14-reviews.md).

## Purpose and bounded extraction

A pupil hears one brief call, compares a specified musical relation, constructs a response and can freely make/listen/revise a version. These are three independent entrances, not a required course or a sequence that must be completed. Retaining a pitch opening while changing an ending is distinct from retaining a rhythm while contrasting melodic direction. Neither event equality nor completed practice counts establish audiation, creativity or instrumental mastery.

Main previously contains Themes 01–02; draft PR #9 contains broader unmerged integration and an Echo implementation. Issue #14 deliberately adapts bounded relevant event/piano, navigation and local-persistence ideas rather than merging PR #9 wholesale. The new musical core is curated, one-bar material at a constant pulse. It does not import PR #9's longer final-motif questions, variable rhythms, rests or level ladder. PR #9 remains draft; this slice does not approve that PR or introduce the prospective year of themes.

**Echo here means the entire four-note call**, not PR #9's final-motif matching rule. It is an optional, honestly named listening scaffold. A correct echo is not automatically a valid variation, and a variation can remain musical while failing an explicitly stated Echo brief.

## Fixed musical material and playback

Convention: MIDI 60 = C4. Every assessed call/reply is one bar in 4/4 at **90 quarter-note beats per minute**, with four sounding quarter notes and no rests. Allowed pitch choices are C4(60), D4(62), E4(64), G4(67), A4(69). Each event has `dur: 1`; a pitch choice does not change its duration.

The common call is:

`C4(60):1 D4(62):1 E4(64):1 G4(67):1`

No count-in or introductory chord is added. Call and reply can be auditioned independently; **Call + response** plays the four-beat call, one **unassessed silent beat**, then the four-beat reply. The gap is explicitly explained in NN/NB/EN and is not a rest inside the answer. Existing bundled sampled-piano playback, load/failure feedback, Stop and navigation cancellation are reused. Actual native decoding/scheduling and decoded signal checks are distinct from physical speaker or human perceptual verification.

A separate sounded model uses a different call, `D4(62):1 E4(64):1 G4(67):1 A4(69):1`.
For change-last or opening/end-C its reply is `D4(62):1 E4(64):1 G4(67):1 C4(60):1`;
for strict descent it is `A4(69):1 G4(67):1 E4(64):1 D4(62):1`. The same 90-BPM
one-beat unassessed gap applies. It demonstrates the brief without identifying a
current-question option and never supplies assessment listening credit. The
native-browser regression checks its pitches and call/reply boundary.

The material is deliberately curated rather than an unbounded question generator. Returning to an entrance/configuration may repeat the same call. Do not interpret repeated completion as new repertoire or measured progress through a curriculum.

## Four freely selected configurations

Schools enable implemented configurations; pupils freely choose among those. Configuration numbers are not ages, attainment equivalences or automatic placement. All retain the same length, timing, pitch pool and controls. Higher numbers do not remove replay or accessibility support.

| Configuration | Musical relation / agency | Exact constrained rule | Held stable and boundary |
| --- | --- | --- | --- |
| 1 — one new ending note | Retain three pitches, change one. | Keep the first three call pitches and all durations; make the last pitch different from the call's last G4. | One bar, four quarters. More than one new ending is valid. Derived from adjudicated example 3, with an additional valid offered variation. |
| 2 — opening and specified ending | Combine a retained opening with a named endpoint. | Keep call pitches C4–D4 at positions 1–2, retain all durations, and end on C4. | Same bar and controls. This is a specified pitch constraint, not “the best” or universally most finished ending. Derived from example 4. |
| 3 — same rhythm, descending reply | Retain rhythmic identity while contrasting melodic direction. | Keep four quarter notes and make every successive pitch strictly lower than the previous pitch. | The pitch opening is **not** retained here; the anchor is rhythm. A repeated pitch or any rise fails this narrow rule. Derived from example 5, not an added harmony/anticipation lesson. |
| 4 — choose a brief and revise | Greater agency within familiar material. | Pupil chooses any of the three preceding briefs; its exact accepted set then applies. | No extra memory, tempo or interface-speed demand. It reuses known relations rather than pretending to add harder notes. Creation still has no right/wrong score. |

Configuration 4's difference is selecting a relation and revising under it, not new musical vocabulary. Its choices are available in listening, building and creation. This is a provisional pedagogical rationale; suitability and meaningful agency require human review. The three entrances and enabled configuration choices remain immediately available; no objective completion unlocks creation.

## Listening: exact notes and complete accepted sets

The instruction explicitly asks the pupil to **select all** replies meeting the displayed brief. Multiple accepted answers are intentional. Call and all three options must finish playing before a constrained listening check records a result; audition and retry have no score penalty. This establishes only that playback completed, not that the pupil heard or understood it.

Every note in this table lasts one quarter-note beat; no notes/rests are omitted. A/B/C are labels, not musical rankings.

| Brief | A | B | C | Accepted set |
| --- | --- | --- | --- | --- |
| 1: change only final pitch | C4(60), D4(62), E4(64), G4(67) | C4(60), D4(62), E4(64), A4(69) | C4(60), D4(62), E4(64), C4(60) | **B, C**. A is the unchanged echo; B/C retain the opening and differ at the final pitch. |
| 2: keep first two, end on C4 | C4(60), D4(62), E4(64), C4(60) | C4(60), D4(62), G4(67), C4(60) | C4(60), E4(64), G4(67), A4(69) | **A, B**. C changes the second anchor pitch and ends on A4. |
| 3: strictly descending four-quarter reply | G4(67), E4(64), D4(62), C4(60) | A4(69), G4(67), E4(64), C4(60) | G4(67), A4(69), E4(64), C4(60) | **A, B**. C initially rises G4→A4. |
| Optional whole-call Echo | C4(60), D4(62), E4(64), G4(67) | C4(60), D4(62), E4(64), A4(69) | C4(60), E4(64), D4(62), G4(67) | **A**. B changes the ending; C exchanges the middle pitches. |

Configuration 4 uses the complete offered set for its selected brief; there is no additional hidden target. Optional Echo uses the same narrow identity rule in every configuration, so its four positions must not be claimed as four differentiated Echo difficulties.

**Feedback boundary:** a successful structural check says the choice follows the stated rule and records practice, not mastery. On failure, pupils are asked to compare selected and unselected replies with the brief, replay and retry. The text distinguishes unchanged echo from variation and acknowledges that another response can be musical. Echo feedback refers to all four call pitches, not the previous PR's final motif.

## Building: sounded pieces and all accepted orders

Choose **two of three two-note pieces without reuse**. Each pitch lasts one quarter-note beat; every completed trial is four beats. Sound each piece, add it using native buttons, remove the last piece or clear the trial, then audition the response alone or paired with the call. No dragging is required.

| Brief | Piece 1 | Piece 2 | Piece 3 | All accepted orders (UI numbers) |
| --- | --- | --- | --- | --- |
| 1: keep three pitches, change final | C4(60):1 D4(62):1 | E4(64):1 A4(69):1 | E4(64):1 C4(60):1 | **1→2, 1→3**. Both retain C4–D4–E4 and replace G4. |
| 2: keep first two, end on C4 | C4(60):1 D4(62):1 | E4(64):1 C4(60):1 | G4(67):1 A4(69):1 | **1→2**. 1→3 retains the opening but ends on A4; other distinct orders lose the specified opening. |
| 3: retain rhythm, descend throughout | G4(67):1 E4(64):1 | D4(62):1 C4(60):1 | A4(69):1 G4(67):1 | **1→2, 3→2**. 3→1 repeats G4 at the joining point; 1→3 rises; the remaining orders do not descend throughout. |

There are six possible distinct two-piece orders per brief; the accepted sets must be checked exhaustively against an independently expressed rule. The code must not accept only the first target order when another construction fits. Configuration 4 reuses the selected brief's pieces and accepted orders. Optional Echo switches to listening; it does not silently change the building task into another exact-copy puzzle.

**Feedback:** incomplete trials ask for two distinct pieces. A changed anchor directs the pupil to replay and compare the opening. An ending mismatch directs attention to the named endpoint or required new final pitch. A contour mismatch asks the pupil to hear each step and distinguish a repeated pitch or rise from strict descent. These are structural observations, not aesthetic judgements. A sounded piece/trial is available for replay; no separate spoken teacher demonstration or sound-based hint should be claimed merely from the presence of this text.

## Creation: free pitch editing, before-version and revision

All four pitches are editable from the five-note pool; all four durations remain one beat. A displayed brief is a **starting suggestion**, not a hidden marking rule. The pupil can retain the anchor, change it, keep an exact echo or explore another reply. Creation is not checked, ranked or given an aesthetic grade. The application must say that all four pitches are editable rather than imply that it automatically protects an opening.

Keep a before-version, change one pitch, audition the before-version and current response, then optionally save. A before-version is optional; there is no compulsory verbal explanation. Saving an unchanged reply is permitted; a saved object is evidence of an explicit pupil choice, not evidence of creative quality.

For example, the following are all playable, saveable creations:

- C4(60):1 D4(62):1 E4(64):1 A4(69):1 — retain the first three pitches, alter the last.
- C4(60):1 D4(62):1 G4(67):1 C4(60):1 — retain two opening pitches, make a different ending.
- A4(69):1 G4(67):1 E4(64):1 C4(60):1 — retain the quarter-note rhythm and contrast the call's rising direction.
- C4(60):1 D4(62):1 E4(64):1 G4(67):1 — an unchanged echo, still admissible in ungraded creation.

This is **narrower than adjudicated example 10**: it borrows the idea of multiple responses, listening and revision, but does not implement its half-note/eighth-note/rest edits. No anticipation, two-bar material, rhythm editor, layered response or full-year expansion is introduced. A fixed rhythm is a scope boundary, not proof that rhythm invention lacks value.

## Proposed short recommendation and instrument transfer

**Illustrative, not an actual teacher endorsement or authorisation to assign unreleased content:** “Theme 03 → Create and revise, suggested configuration 1. Hear the call, keep its opening and try two final notes. Hear each reply with the call. Decide whether to keep this version or change it once more, then stop after that comparison in 3–5 minutes. You may stop with a question.” The teacher can instead name one listening comparison or one building trial. No teacher account, assignment system, monitoring or extra per-exercise school configuration is required.

The short route is **one useful exercise**, not a required tour of all three entrances, not a timer or a promise that every pupil finishes inside five minutes. Longer exploration is optional. Replay, stopping, direct creation and changing to another school-enabled configuration are pupil choices. A saved object, a correct check or a completed sequence is not required to stop.

Try singing or playing the opening and two endings in a comfortable register. A teacher may adapt key/register to an instrument, making clear when a named C4 constraint has been transposed. Tapping can illustrate retained rhythm but cannot demonstrate retained pitches or contour. The app collects no microphone input and does not grade instrumental performance. The current text and controls are hypotheses for independent pupil use, not verified age-suitability claims.

## Progress, compatibility and school boundaries

Theme 03 uses an optional validated `conversationPractice` extension. Version 2 separates the new work from unmerged PR #9's version-1 Echo semantics:

- `level` records a chosen configuration, not inferred ability.
- `done` records bounded completed `listen`, `build` and optional `echo` rounds by configuration; these are practice counts, not mastery scores or creation grades.
- `creations` holds at most 20 explicitly saved call/response pairs with configuration, selected brief and optional before-version. Duplicate identical saved objects are reported rather than silently inserted.
- `legacyEcho` preserves validated imported version-1 Echo counts/creations separately. Legacy work is not converted into retain/change completion. Its original 108-BPM audition is preserved. Its archived musical material can be auditioned only where the theme/configuration is enabled.

Unfinished selections, piece orders and current before-version/editing drafts are not promised to survive reload. In-session creation drafts are stashed by configuration/brief when moving between relevant controls. Saved objects, completed practice and supported legacy archives appear in My practice and Export/Import. Older backups lacking the optional Theme 03 extension preserve newer local Theme 03 work; explicit replacement imports follow the common validated/confirmed backup semantics. Invalid data rejects instead of being treated as new work. Actual implementation and tests must verify these claims, including damaged/denied storage and bound checks.

Existing Theme 01/02 progress, saved rhythms, pupil language choice and school branding/settings changes must remain compatible. School restrictions filter availability and reopening without deleting valid work; no administrator editor is added to the pupil app. No accounts, analytics, online data service, microphone or pupil identity is introduced. School prototype packaging remains subject to the unchanged release decision; a checkbox or imported settings cannot make missing educational evidence pass.

## Verification and human review limits

Automated evidence should independently check every brief, all option sets and all six piece permutations, fixed pitch/duration bounds, NN/NB/EN semantic coverage, native browser audio/loading/stop/navigation cancellation, mobile/desktop viewport controls, keyboard operation, persistence/import and school preview/extracted package behavior. Written rules, actual note events, heard renderer/signal and accepted sets must agree; checking only a generator against itself is insufficient.

Record actual command results, browser versions, signal/audio coverage and limitations in the implementation PR. Do not copy passing evidence from PR #9 to this changed candidate. A viewport is not a physical phone; native decode is not speaker output; model reviews are not qualified human endorsements. Independent human musical review, actual teacher-adoption/design-fit observations and facilitated pupil/access/device evidence remain separate **PENDING** gates. A genuine test failure stays FAIL; successful development checks still cannot approve pupil release.
