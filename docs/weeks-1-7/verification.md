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

Final candidate runs are recorded below after execution. Until then the new integration
is under verification. A prior104case native batch passed; subsequent independent
review added fault, timbre, target-credit, loop and reset regressions. An expanded
112case batch had108PASS and4FAIL: the audio fault fixture failed to suspend its
already-running context (test setup defect); header click/focus scrolling prevented
reset (reproduced application defect). Their repairs are retained with stronger tests.
A targeted12case native batch subsequently passed, including two actual loop cycles,
early versus completed Stop, unavailable Web Audio, and queued old reset messages.
A final review found an additional Week4 restored-progress element mismatch; fixed
using a guarded per-week progress target and covered by a revisit regression.

## All21task checklist

Status applies to the final native desktop/tablet-emulation test run, not human use.
Updated below from its actual report after execution. End-to-end human use remains
NOT TESTED for every row.

|Week.task|Activity|Native development status|Required evidence|
|---|---|---|---|
|1.1|Hald pulsen|NOT TESTED (final candidate pending)|Timed Space taps, beat coverage, reject click spam|
|1.2|Finn noteverdien|NOT TESTED (final candidate pending)|Five questions, wrong/repeated answer locks|
|1.3|Bygg ein rytme|NOT TESTED (final candidate pending)|Four bars, three stages, rests/edit, real loop/Stop|
|2.1|Høyr forskjellen|NOT TESTED (final candidate pending)|Four rounds, heard reference/A/B, wrong answer|
|2.2|Set frasane saman|NOT TESTED (final candidate pending)|3→6→9 cards, notation and tap reorder|
|2.3|Høyr og bygg|NOT TESTED (final candidate pending)|Fresh melodies, three consecutive, wrong resets|
|3.1|Finn tonen i notane|NOT TESTED (final candidate pending)|Three heard matches and wrong rejection|
|3.2|Kva note er dette?|NOT TESTED (final candidate pending)|Five names/staff questions, wrong rejection|
|3.3|Plasser tonen|NOT TESTED (final candidate pending)|Four heard placements and next-round reset|
|4.1|Bygg ein akkord|NOT TESTED (final candidate pending)|Four unordered triads, non-C selection first|
|4.2|Utforsk akkorden|NOT TESTED (final candidate pending)|Exploration, current changed-third hearing/comparison|
|4.3|Lag ein akkordprogresjon|NOT TESTED (final candidate pending)|Completed original/edit/compare, edit invalidation|
|5.1|Høyr returen|NOT TESTED (final candidate pending)|Three separate reference/alternative auditions|
|5.2|Bygg musikken|NOT TESTED (final candidate pending)|Three reconstructions, notation, click reorder|
|5.3|Lag ein variasjon|NOT TESTED (final candidate pending)|Original duration controls, three actual stages|
|6.1|Same melodi – ulik klang|NOT TESTED (final candidate pending)|Same4notes/3distinct voices, parts/together|
|6.2|Kva lyd manglar?|NOT TESTED (final candidate pending)|Four rounds,8positions, omission/answer lock|
|6.3|Bygg eit lite samspel|NOT TESTED (final candidate pending)|Four-beat bars, edit, automatic final completion|
|7.1|Finn taktarten|NOT TESTED (final candidate pending)|Four heard rounds, wrong rejection,3+3grouping|
|7.2|Flytt taktstrekane|NOT TESTED (final candidate pending)|Wrong/reset, exact3/4then4/4boundaries|
|7.3|Dansande taktar|NOT TESTED (final candidate pending)|Three metres, edit/accent/rest, final grid retained|

## Independent non-human reviews

Two independent AI reviewers inspected original and generated code for musical
correctness and progression/test weaknesses. Their feedback produced fixes and
regressions for W3 target-only listening, W4 click-credit/octaves, W5 pair notation/
round freshness, W6 actual timbral distinction and layer duration, W7 compound grouping,
missing AudioContext, completed-review state and queued-reset ordering. The music
review's bounded final source/VM checks passed. Stage review requested the final
Week4 revisit and before-ack reset cases. Neither reviewer supplied teacher, audible
speaker or physical-device evidence.

## Remaining human checks

NOT TESTED: Windows Edge local-file opening, physical Android local-file opening,
audible sound balance/pitches/timbres on real speakers, natural-language review of
all activity/error strings, screen-reader/AT operation, curriculum/teacher validation,
and an unseeded full21task pupil-like walkthrough. A managed browser's local-file
block must remain a failure, never a security exception or skipped test. Existing
Theme01 quick-entry expected failures also remain explicitly unresolved.
