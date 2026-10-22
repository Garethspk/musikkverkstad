# Issue 14 — bounded Theme 03 implementation (draft review)

The current branch implements retain/change through three visible entrances:
compare all valid replies, construct a response under a declared musical brief,
and create/hear/revise/save an ungraded reply. Optional Echo copies the whole
four-note call and records narrow practice separately. All new material is one bar
of four quarter notes at 90 BPM; levels change relation/agency, not length or speed.
See [exact events, answers and limitations](docs/theme-03.md) and
[independent non-human reviews](docs/curriculum/issue14-reviews.md).

Schema-1 school settings migrate without enabling Theme 03 automatically. New
schema-2 defaults include the implemented prototype; unavailable content remains
rejected. Existing pupil keys, language preferences and Theme 01/02 work survive.
The optional version-2 conversation backup keeps explicit old Echo history separate;
missing older-backup extensions preserve newer local work. Saved replies include
an optional before-version for comparison. Temporary drafts are session-only.
The adult teacher kit remains restricted to Theme 02, despite shared runtime bytes.

Full verification results are recorded in the draft PR; actual local browser-policy
failures remain failures. Human teacher/musical review, teacher adoption, audible
physical-speaker/device/accessibility and pupil evidence remain **PENDING**.
Pupil release remains **BLOCKED**. No PR #9 merge, deployment, publication, teacher
contact or pupil distribution is authorised or performed. Earlier entries below
are historical snapshots, not descriptions of this increment.

---

# Issue 12 — private adult Theme 02 testing entry (review pending)

A preconfigured standalone `.quality/teacher-kit/teacher-review.html` reuses the existing opaque
school preview and local audio transport. One button enters actual Theme 02 Listen,
level 1; normal level/activity controls remain. It is adult-only, not a pupil release,
with no admin form/export control in the outer shell. The manifest pins source,
template and HTML identity; native audio and cancellation/security tests are added.
See [private teacher kit](docs/teacher-testing/README.md) for maintainer preparation,
Nynorsk opening instructions and a blank physical-device listening checklist.
Teacher feedback/adoption and physical listening remain PENDING. Pupil release
remains BLOCKED; local file-policy failures must remain failures, not bypassed.
No Theme 03, deployment, teacher contact or pupil distribution is included.

---

# Phase 3 — pupil activity access and progress

Issue #6 exposes all three Theme 01 activity controls on welcome, Start here, Continue,
theme-selector and direct entrances. The two former expected-failure cases are
ordinary regressions. Keyboard and free school-enabled level selection are retained.
Theme 02 now saves per-mode/level completed-round counts, chosen level and up to
20 explicit rhythm creations in a validated version-1 extension of existing local
progress/backup data. Counts record practice, not mastery; unfinished questions are
not restored. Older backups without this extension preserve current Theme 02 history.
Unknown/corrupt extensions reject atomically; damaged stored data is not overwritten
by practice. Denied/quota storage keeps work in memory and allows export.

School-disabled themes/levels cannot be reopened from saved rhythms, but their valid
history remains visible and exportable. Audio scheduling/cancellation and school
preview isolation are unchanged. School setup/publishing text now accurately describes
Theme 02 persistence. See docs/pupil-progress.md for compatibility and evidence limits.
The full-gate, independent-review and CI results for this increment are recorded in
its PR. Pupil release remains **BLOCKED**. Earlier snapshots below retain their
historical limitations and test counts.

---

# Phase 2B — school prototype preview and ZIP export

Issue #4 adds the nontechnical Configure → Preview → Download workflow to the
separate Nynorsk administrator artifact. School staff can open its standalone HTML
locally; preview uses the actual configured pupil files in an opaque sandbox with
only temporary storage. Browser-generated deterministic ZIPs contain only pupil
pages, local piano/credits, validated settings, publishing instructions and a
BLOCKED identity manifest. No administrator, preview adapter, external service or
new curriculum is included. Older v1 restrictions and existing pupil storage keys
are preserved. See docs/school-setup.md for operation and architecture.

The preview retains restrictive CSP; its local sample transport passes exact
candidate bytes to native decoding, while extracted-package tests load samples
through real HTTP. Mobile viewport checks are not physical-phone tests. Current
pupil release remains **BLOCKED**, without an override or inherited base PASS.
The two existing Theme 01 quick-entry failures remain explicit expected failures.
Stage 2 source review found no remaining security blocker. Follow-up investigation
classified the intermittent preview-language→download as input/scroll-render timing
in alternate local Chromium 154: the input reached the old iframe surface rather
than the enabled parent button. Rendering synchronisation before one genuine
pointer action resolves the reproduced case without changing application code or
security. A repeated three-language regression retains real ZIP/identity checks.
Local managed URL policy explicitly excludes file://; the two standalone tests
remain enabled and fail before execution locally. The matching CI browser runs
those same standalone tests. See [PR #5 verification](docs/pr-5-verification.md)
for evidence and limits; exact full-gate/CI results are recorded in the PR.
Earlier milestone statements below describe historical snapshots.

---

# PR #3 review update — principal workflow

The main setup form now asks only for school branding, default language and optional
colours. All eligible prototype content/levels are included by default. The 11–13
audience is informational. Exceptional theme/level restrictions are under collapsed
Avanserte innstillingar; earlier valid v1 settings retain restrictions and open that
section with a clear notice when imported or restored. The schema stays at version 1.
Availability flags fail closed for future/unimplemented/ineligible content; prototype
availability does not change pupilRelease BLOCKED. New tests cover the no-checklist
workflow, keyboard access, exact older-v1 round-trips and branding-only edits.
An isolated real-build revocation fixture also verifies that ineligible auxiliary
activities disappear from cards and cannot open through direct/restored navigation,
while historical counts survive. Local full-gate verification: all 14 Node suites
and 60 real Chromium cases pass; the two existing Theme 01 expected failures remain.
The standard gate exits 2 and pupil release remains BLOCKED.

# Phase 2 — School administrator configuration MVP

Phase 1 was merged into main at 03c38ef after GitHub Actions passed on PR #1.
Phase 2 adds a separate Nynorsk setup artifact, shared version-1 settings validation
and content registry, safe local logo processing, accessible colour presets,
settings download/reimport/drafts and a read-only pupil settings loader. Only the
implemented 11–13 age group and Themes 01/02 are configurable. Pupils freely choose
among enabled levels. Existing progress and language preference keys are preserved.
See docs/school-setup.md for operating instructions and exact limitations.

Local verification: the complete development gate passes all 14 Node suites
(including the 13 original suites) and 54 real Chromium cases across desktop/mobile
profiles. Two existing Theme 01 quick-entry failures remain explicitly expected.
The standard gate exits 2 with pupilRelease BLOCKED. Independent review completed
two bounded passes; no remaining functional/security blocker was reported.

At this historical Phase 2 milestone ZIP publishing and full preview were not implemented. The setup directory must stay
separate from published pupil files. No accounts/backend, pupil identity fields,
analytics or new curriculum were added. Pupil release remains BLOCKED; historical
export notes and Phase 1 results below describe their respective snapshots.

---

# Phase 1 development reliability update

The application source, generated pages, design and curriculum remain unchanged.
The development gate now treats absent Work hosting metadata as optional
provenance, includes every original Node suite and runs real Chromium desktop
and mobile-viewport checks. A locked Playwright dependency and GitHub Actions
workflow are provided. See docs/development-quality.md for commands, evidence
limits and the expected-failing Theme 01 quick-entry tab requirement.

Local verification: all 13 Node suites pass; the build preserves the existing
`dist` bytes. Playwright against installed Chromium 154.0.8037.57 yields 34 passing
cases and two expected failures for the existing Theme 01 quick-entry tabs issue.
Both desktop and mobile viewport profiles ran. The prototype gate exits 0 while
retaining pupilRelease BLOCKED. Missing Playwright and missing Python were separately
verified to fail the gate and replace the report with FAIL. GitHub Actions has not
been run remotely. The managed browser download was blocked by environment network
policy, so local runs explicitly selected installed Chromium; CI uses the matching
Playwright-managed build. No app source/generated files or Work deployment changed.

Pupil release remains BLOCKED: limited browser automation is not physical-device,
rendered-audio, comprehensive browser or independent-review evidence. The historical
export status below remains useful for feature and recovery history; its missing
browser-test/CI statements describe the pre-Phase-1 snapshot.

---

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
