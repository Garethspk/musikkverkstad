# Phase0: one mixed activity week (draft implementation)

The separate [Phase0 design and evidence boundaries](docs/phase-0/design.md) describe
one playable week: Pulse trail, Symbol mechanic and Rhythm workshop. Three independent
choices share grid/choice/revision components; no mandatory tour or audio prerequisite.
School schema5 validates historical v1/v3 restrictions before migrating with the
programme disabled. Draft PR15 schema4 remains unsupported on this main-based branch;
no Conversation content is copied or enabled. Existing Theme01/02/Form and their
archives remain intact; optional programme progress has strict missing/replacement
import semantics. Teacher kit stays Theme02-only. Human validation PENDING and pupil
release BLOCKED. Exact-head tests/CI and local file-policy failures belong in the draft PR.
No merge, deployment or distribution. Weeks2–6 remain separately authorised future
increments, not additional implemented shells. Earlier milestones below are historical.

# Issue16 — visual Formverkstad prototype

Formverkstad adds visual musical-form puzzles, construction and ungraded map
creation/revision. It is an auxiliary activity beside the existing two themes,
with freely selected configurations and no required sound. See the
[reviewed design and eleven worked cases](docs/form-design/README.md),
[independent AI critiques](docs/form-design/reviews.md) and
[school compatibility/PR15 integration plan](docs/form-design/integration.md).
Human educational/adoption/device evidence remains PENDING; pupil release BLOCKED.
PR #15 is separate and unmerged. No deployment or pupil distribution is included.

# Phase 3 — pupil navigation and Theme 02 progress

Theme 01 shows listening, rebuilding and creation controls immediately on every
entrance, including Start here. Theme 02 now stores completed listening/repair
round counts, the chosen level and up to 20 explicitly saved rhythms, with validated
Export/Import. Unfinished questions remain temporary. See
[progress compatibility](docs/pupil-progress.md). No curriculum or audio engine
change is included; pupil release remains **BLOCKED**.

# School setup and prototype packages — Phase 2B

The separate Nynorsk setup page builds to `setup/index.html`; pupil files remain
in `dist`. See [docs/school-setup.md](docs/school-setup.md) for local use, settings
export/import and `--school-settings` builds. School configuration covers branding,
logo, default language, accessible presets, implemented age groups/themes/levels.
The principal-facing form asks only for branding, language and optional colours;
all eligible prototype content is included by default. Optional restrictions live
in collapsed Avanserte innstillingar and older imported restrictions are preserved.
Pupils retain choices within enabled levels. School staff can open the standalone
`setup/index.html`, preview the real pupil app at desktop/mobile viewport sizes and
download a self-contained ZIP without development tools. Extracted pupil files need
ordinary static HTTP hosting. Downloads are for private prototype review only;
pupil release remains **BLOCKED**, with no administrator in the pupil ZIP.

# Development reliability — Phase 1

The school configuration architecture and implementation plan are in [ROADMAP.md](ROADMAP.md).
The settings and prototype package increments are implemented; exact-output pupil-release evidence remains pending.

The current development workflow is documented in [docs/development-quality.md](docs/development-quality.md).
Use Node 24 and Python 3.12: `npm ci`, `npx playwright install --with-deps chromium`,
then `npm run quality`. All original 13 Node suites, school/package suites and real Chromium desktop/mobile tests
are included. Passing development checks returns exit 2 with pupil release BLOCKED;
`npm run quality:prototype` permits exit 0 for private-prototype development only.
The former Theme 01 quick-entry failures are now ordinary passing regressions.
Hosting metadata is optional provenance; no original hosting details are recreated.
No application content or deployment is changed by this reliability phase.

The export notes below are historical. Their statements that the gate uses
`python`, requires hosting metadata, omits browser checks or has no CI workflow
are superseded by the Phase 1 workflow. Running the existing built app still
requires only a local HTTP server, with no npm installation.

---

# Musikkverkstad export — local setup

This export contains the exact application source and existing built files from
commit a05488709923114a3fa20011f1519b9c2561f198 (published version 19).
Read PROJECT_STATUS.md first: Theme 03 is not present in the saved application.
The application was not rebuilt or redesigned for export. The original README
is preserved verbatim at docs/README_WORK_ORIGINAL.md and also follows below.

## Run the existing application locally

Install/use Python 3. From this directory run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

On Windows, `py -3` can replace `python3`. Open http://127.0.0.1:8000/ in a
browser. No npm install or build is required for these existing dist files.
index.html chooses the saved language or Nynorsk; explicit pages are nn.html,
nb.html and en.html. Use the menu for Språk and Test sound. Audio files are
bundled under dist/sounds and fetched locally, so use HTTP rather than file://.
Stop the server with Ctrl+C. These are local-run instructions; the server/browser
was not launched during export. Local progress belongs to this origin, not the
old hosted URL. Use the existing app's Export/Import for its supported data.

## Development after import into Codex

Python 3 builds language pages; Node.js runs tests, using standard libraries only.
Node 24 was used for the export checks (exact version in EXPORT_TEST_RESULTS.json).
Keep src/, dist/, tests/, scripts/, translate.py and translations-extra.txt together.
After future source edits, build with `python3 translate.py` from the project root.
This overwrites dist; do not do it merely to inspect this original snapshot.
Run an existing test with `node tests/navigation.cjs` (other suites are in tests/).
Full future gate: `node scripts/quality-gate.cjs`; it uses the `python` command
internally, so ensure that resolves to Python 3. The gate rebuilds dist and exits
2 when code passes but pupil-release evidence is missing. `--prototype` permits
exit 0 for a private prototype, never a pupil-ready approval. See AGENTS.md.

## Migration boundaries and integrity

No Git credentials, Git working history, browser pupil data, or deployment helper
binaries are included. `.openai/hosting.json` is the original Site manifest and
identifies the existing Work Site: retain it as provenance, but do not invoke
Sites publishing or use its project ID to deploy changes without new authorisation.
Import these files into the new development repository; no GitHub push is performed
by this export. The original Work project has not been changed or deleted.

EXPORT_SOURCE_MANIFEST.json lists original files and SHA-256 hashes. The original
README's archivedPath points to docs/README_WORK_ORIGINAL.md, because this local
setup section was added to the exported README only. All other original files
remain byte-for-byte unchanged. EXPORT_TEST_RESULTS.json contains actual outputs
from directly running all 13 existing test scripts, without rebuilding.

---

# Musikkverkstad

Private browser prototype for learners aged 11–13 with some musical experience.

## Build and test
- Edit the original interface in src/app.nn.html.
- Edit translations in translate.py and translations-extra.txt.
- Edit studio styling in src/studio.css.
- Edit the weekly theme in src/theme.js. Its translation dictionary is self-contained and injected after translating the surrounding app.
- Run: python3 translate.py
- Run: node tests/audio.cjs
- Run: node tests/theme.cjs

The build creates Nynorsk, Bokmål and English pages in dist/. Progress is local to the browser and origin. The selected language is remembered separately.

## Theme 01: Same start, different ending
The first visit offers a guided quick challenge or free exploration. Listening asks learners to find the exact matching ending. Rebuilding advances to the next empty note slot; previously filled slots remain editable. Learners can freely choose listening, reconstruction or composition. Four provisional levels vary ending length; pitch vocabulary and quarter-note rhythm remain constant. All melodies have eight quarter notes, grouped in two 4/4 bars. Composition accepts multiple solutions and does not grade aesthetic quality. Task completion is evidence of participation, not a claim of instrumental transfer or independent mastery.

## Verification boundaries
Automated tests simulate the DOM and Web Audio scheduling. They cannot confirm physical speaker output or mobile layout. The user confirmed the Test sound tones on their phone after the playback-session fix. Exercise playback and new theme playback still need real-device testing.

No microphone, pupil accounts, analytics or external audio libraries are used by the app. Hosting manages access to this private prototype.

## Studio update
Theme playback uses pitch-neutral numbered position markers. These follow scheduled notes and clear on Stop or navigation; no answer pitches are revealed. My practice includes theme completion markers and saved variants, with playback and reopening. Identical theme saves at the same level are deduplicated.

## Sound comparison demo
Separate sound-compare.html offers the existing triangle tone, additive warm synthesis, and sampled piano. Shared fixed note/timing sequences, no added reverb, approximate peak-level matching (not perceptual loudness calibration). Five self-hosted Salamander MP3 files are loaded on first piano request. Credit/license in src/sounds/ATTRIBUTION.txt and the page footer. The exercise sound engine is unchanged.
Run node tests/sound-compare.cjs for simulated playback checks.

## Quality workflow

Run `node scripts/quality-gate.cjs` for the pupil-release decision. It rebuilds
all locales, runs the regression suites and writes `.quality/latest.json` with
a content hash and the base Git commit. Exit 1 means a build/test failure;
exit 2 means code passes but required release evidence is missing. There is
currently no path to a pupil-release PASS: browser, rendered audio, real-device
and version-specific independent-review adapters are not installed.

For an explicitly private prototype update, run
`node scripts/quality-gate.cjs --prototype`. This allows exit 0 after passing
code checks but still records pupilRelease BLOCKED. It is not approval for a
pupil-ready release. Run it as a packaging command so a failed check prevents
packaging/publication through the supported workflow. This is a local gate,
not a remotely enforced CI branch protection rule or an unattended agent loop.

The weekly theme now labels its opening chord, pause and melody; higher
listening levels require locating the changed note (3) and identifying its
pitch direction (4). Progress remains “explored”, including existing progress.
Focus restoration has unit coverage; actual browser and assistive-technology
behaviour remains unverified.

## Phrase Puzzle

The home page now links to Phrase Puzzle / Melodipuslespel. Levels use two,
three and four distinct two-note fragments; level 4 introduces one repeated
fragment. Preview and placement are separate controls. Answers are evaluated
by the resulting pitch sequence. There is no introductory chord. Unfinished round state
is temporary; completed rounds and selected levels now persist in My practice.
The puzzle suite checks all locales, complete/incomplete/wrong ordering,
repeat handling, piano-only output and cancellation while samples load.

## Notation Match

Notation Match / Lyd og notar connects sampled-piano melodies to treble-clef
pitch notation. Four levels vary phrase length, pitch pool and choice count.
Every phrase begins on C4; there is no introduction. All notes are equal
quarter notes and the short exercises intentionally omit barlines.
Selecting a score highlights it; Check answer submits. Note names are an
explicit support/text-alternative mode. Completed rounds now persist in My practice, with
first-check results and supported completions distinguished; no mastery is inferred. New notation tests independently
check staff coordinates, unique correct choices, pitch pools, select/check
behaviour, sampled output, tempo and interrupted loading.

## Progress extension

Phrase Puzzle and Notation Match use the validated optional extraPractice
field inside the existing main progress object. Old stored data migrates to
zero counts. Export includes it; malformed supplied values reject the import
before mutation. Importing an old backup warns before resetting these counts.
Each round records at most one completion. Note-name support is sticky for a
round; an empty Check does not count as an attempted answer. Storage failures
retain in-memory progress and display export recovery instructions.

## Theme 02: Find the groove

The second optional theme combines rhythm matching, rhythm reconstruction and
free rhythm building. Four settings vary phrase length (one/two 4/4 bars) and
grid subdivision (quarter/eighth notes); they are different challenges, not
validated difficulty rankings. All sounds use the shared sampled piano engine.
Completed rounds and explicitly saved rhythms now persist and enter validated
Export/Import; unfinished questions remain temporary. Existing themes and saved
progress remain available.
Source: src/groove.js. Independent music/logic checks: tests/groove.cjs.

## Theme navigation and return visits

A compact theme selector offers previous/next controls and a menu of available
themes. Theme numbers organise content; no completion prerequisite or automatic
ability placement is introduced. First visits offer Start here; return visits
can Continue at their last activity, mode and chosen level. Only validated
navigation preferences are stored separately from practice results. Continue
is not a promise to restore unfinished answers after reloading. Browser storage
restrictions may prevent remembering the location between visits.
