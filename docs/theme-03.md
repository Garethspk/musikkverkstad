# Theme 03 — Musical conversations (private prototype)

Ages 11–13, with some musical experience. Three immediately visible independent
activities use the existing local sampled piano. No microphone, accounts or network
services are added. Prototype availability is not pupil-release approval: BLOCKED.

## Actual musical contract

Listen and compare teaches one objective rule before asking for an answer:
**repeat the call's final motif exactly in pitches, rests and beat lengths**.
Other responses may be musically valid but do not meet this exercise's echo rule.
There is exactly one matching alternative. The distractor changes one sounding pitch
by at least a whole tone within C4/D4/E4/G4/A4 (levels 1–2 use C4/D4/E4); timings and
rests are identical. This is an echo-based musical conversation, not a definition
of every appropriate response or a judgement of musical taste.

Build the response reconstructs that same final motif from distinct short fragments.
Each fragment is used once, via separate Play and Add buttons; Remove/Clear support
retry without dragging. Exactly one fragment permutation matches the motif. Create
uses the level's rhythm and editable pitch/rest selectors. Pupils can play, revise,
hear call + response and optionally save. No objective/aesthetic grade is applied.
Silence-only saves are rejected because playback would provide no response.

| Level | Response | Call prefix | Reconstruction |
| --- | --- | --- | --- |
| 1 | 2 different quarter-note pitches, 2 beats | 2 quarter notes | 2 single-note fragments |
| 2 | 4 quarter notes, 4 beats | 4 quarter notes | 2 two-note fragments |
| 3 | 4 notes, durations 0.5/0.5/1/2 beats | 4 quarter notes | 2 two-note fragments |
| 4 | 6 positions, durations 0.5/0.5/1/0.5/0.5/1; position 4 is a rest | 4 quarter notes | 3 two-event fragments |

The call ends with the assessed motif. Call and response buttons play separately,
without chord/context/count-in. Call + response inserts **one unassessed silent beat**
between them. Short motifs are not claimed to be complete 4/4 bars. Tempo is 108 BPM.
Level numbers are provisional configurations freely chosen, not validated ability
rankings. Hint can reveal/play the final motif; repeated/supported work counts only
as practice. Listening requires the full call and both alternatives to finish before
choosing. Build/create have no prerequisite listening task. Stop/navigation cancel
native playback/loading through the original audio-session token and timer controls.

## Progress and school integration

`conversationPractice` is an optional version-1 extension in existing main version-1
pupil progress and backup storage: `{version,level,done,creations}`. Counts use
listen/build keys for levels 1–4, one credit per round, bounded at 1000000. At most
20 saved responses contain `{level,call,response}` with bounded valid pitches/rests
and the level's durations/lengths. Both call and response are saved so reopening
preserves the actual conversation. Musical equality ignores JSON property order.

Missing progress extension migrates to empty history on old local load. Importing
an older backup without it preserves current Theme 03 history; an explicit extension
replaces it after the existing confirmation. Invalid future/corrupt data rejects
before mutation. Existing Theme 01/02/other practice and language preferences remain.
Corrupt raw storage is protected; denied/quota storage retains exportable in-memory
work. Questions, heard flags, unfinished reconstruction and unsaved edits do not
resume. My practice retains historical achievements even if school content is disabled;
both saved-opening controls and handlers check enabled themes/levels.

Stable registry ID is `conversation`, navigation index 2. School schema **2** supports
all three implemented themes. New defaults include all eligible prototypes. Schema-1
imports validate against their original Theme 01/02 IDs/levels, then migrate to 2:
all earlier theme/level choices are preserved, new levels are initialised but Theme 03
is **not enabled**. Even an unrestricted old school configuration must opt in. Unknown
schemas or schema-1 attempts to inject Theme 03 reject without changing the form.
Migrated restrictions are shown in Advanced settings. Original JSON files are untouched.

The generated administrator template declares settings schema 2, pins its bytes and
uses the existing allowlisted pupil file map. Preview and ZIP contain the same actual
Theme 03 application; preview storage remains temporary and sandboxed. ZIP excludes
the administrator/preview adapter and is still private prototype only. No release PASS
is inherited or enabled by this curriculum increment.

## Independent review and evidence limits

A separate model-based source/music-fact-check reviewer inspected the actual generator,
accepted answers, audible pitch differences, rhythm/rest semantics, differentiation,
NN/NB/EN instructions and migration. It independently checked **40000 seeded items**:
unique answer and reconstruction, exactly one changed sounding pitch. It found a real
saved-opening defect: the hint target initially referred to a fresh item rather than
the saved call. The implementation now derives it from the saved call tail, with a
real-browser reopening regression. Final verification is recorded in the PR.

This is independent source/generated-data review, **not an authenticated human teacher,
real pupil study, perceptual listening or speaker/device approval**. It cannot fill the
missing version-bound independent-review release adapter. Required evidence stays BLOCKED.

Automated tests independently examine 800 deterministic items per language, reject
identical/ambiguous alternatives, check unique reconstruction permutations and observe
mock-scheduled sampled pitch/onsets/rest duration for every level. VM scheduling tests
are simulations. Real Chromium desktop/mobile tests operate all three activities in all
languages, decode/play the actual five piano MP3s, stop and cancel delayed loading, check
HTTP failure/retry paths, saved reopening/backup and denied/corrupt storage. Native browser
input tests also exercise school restrictions, schema migration, actual isolated preview
and extracted ZIP playback. They are not physical-phone or audible-speaker evidence.
Local managed file:// policy failures remain explicit; CI tests standalone files unchanged.
