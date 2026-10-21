# Musikkverkstad — project status

Export date: 2026-10-21. This is the actual latest saved/published application,
Site version 19, source commit `a05488709923114a3fa20011f1519b9c2561f198`.
Live project: https://musikkverkstad-home.gwhi.chatgpt.site (owner-private).

## Recovery and missing work

Automated workspace maintenance removed the working directory before this export.
The exact saved repository was recovered into a separate directory. All 47 tracked
files were recovered, including source, compiled HTML, audio, tests and scripts.
No application file has been recreated from chat or redesigned for this export.

Theme 03 (Musical conversations) was being developed but was NOT committed or
published in the recovered version. `src/conversation.js` and
`tests/conversation.cjs` are absent. In-progress changes extending the selector
to three themes and exposing Theme 01's three activities on every entry screen
are also not present. Do not treat the preceding chat's implementation plans as
completed application features. No copy was found in the available Library
inventory. These are explicitly unfinished/missing, not silently reconstructed.

The previous ignored `.quality/latest.json` report is absent; it was local-only.
A fresh, separate EXPORT_TEST_RESULTS.json records only tests actually run here.
No Git history or credentials are included. Original hosting.json is retained
for provenance, not as permission to publish back to the Work project.

## Implemented

- Nynorsk, Bokmål and English pages, selected language remembered locally.
- Compact mobile header: Home, previous/theme-dropdown/next, tools menu.
- Tools menu: Språk (full language names), sound test/volume, My practice, help.
- Theme 01: Same start, different ending — listen, rebuild ending, create.
- Theme 02: Find the groove — listen, one-cell repair, creative rhythm grid.
- Four levels/configurations; activities are optional, without prerequisites.
- Rhythm repair, melody detective, harmony hearing and melody workshop.
- Phrase Puzzle (order fragments) and Notation Match (piano/treble notation).
- Sampled Salamander piano using five bundled MP3 samples; shared Stop and
  cancellation during loading/navigation. Separate historical A/B/C sound demo.
- Main practice progress and saved melodies, Theme 01 progress/creations,
  validated Export/Import and migration checks. All stored in browser localStorage.
- Start here and Continue: remembers activity, level and theme mode, not a saved
  unfinished question. No forced ability placement.
- Theme 02 work remains session-only, excluded from progress/export.

## Known issues and limitations

- User-reported discoverability issue: Theme 01's quick/welcome entrance hides
  the three activity tabs behind 'Choose activity and level'. All three activities
  exist, but should be made consistently visible. This is NOT fixed in this snapshot.
- Browser/mobile rendering, keyboard/screen-reader behavior and physical-device
  sound are not comprehensively verified. Earlier browser preview was denied by
  browser URL policy; no workaround was used. Source size calculations are not
  rendered-phone evidence.
- VM audio tests check scheduled notes/timing with mocked decoding, not perceptual
  sound quality, actual MP3 decoding or audible speaker output. Earlier user
  confirmation of Test sound is not validation of every activity or new version.
- No study with real target-age pupils; simulated review is not such a study.
- No accounts, synchronization, multiple child profiles, backend pupil storage,
  app-store package, service-worker offline installation or full-year curriculum.
- The hosted app is multi-file. It is not the original self-contained single HTML
  prototype. Serve dist over HTTP; do not rely on file:// audio loading.
- Local progress is tied to browser/origin; changing host/port starts separate
  storage. Existing Export/Import covers only its documented supported data.
- No supported automatic pupil-release PASS: required browser/rendered-audio/
  real-device/version-bound review evidence adapters are absent. Current pipeline
  is local scripted checks, not a fully unattended year-content release system.

## Verification performed for this export

All 13 existing tests/*.cjs scripts ran directly against unchanged committed dist
files under Node (exact version and output in EXPORT_TEST_RESULTS.json). All exited
0: audio, full-audit, groove, navigation, notation, piano, practice, puzzle,
quality-gate, quality-regressions, sound-compare, studio, theme.
No build, new browser test, phone test or deployment was performed for this export.
Archive integrity and original-file SHA-256 equality are checked during packaging.
Historical developer notes remain in docs/quality-status.md and the original README.

## Next development priorities

1. Make all three activities visible consistently, including Theme 01 Start here.
2. Implement/review Theme 03 from the agreed brief; it is not recoverable code here.
3. Add proper persistence for Theme 02/03 with validated backup/migration support.
4. Obtain supported browser and physical-device audio evidence before pupil release.
5. Grow the activity bank and curriculum while retaining bounded independent
   teacher/test review, unambiguous answers and honest completion reporting.
