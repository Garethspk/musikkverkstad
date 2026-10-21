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
This theme's work is session-only for now; it does not enter saved progress or
Export/Import. Existing themes and saved progress remain available.
Source: src/groove.js. Independent music/logic checks: tests/groove.cjs.

## Theme navigation and return visits

A compact theme selector offers previous/next controls and a menu of available
themes. Theme numbers organise content; no completion prerequisite or automatic
ability placement is introduced. First visits offer Start here; return visits
can Continue at their last activity, mode and chosen level. Only validated
navigation preferences are stored separately from practice results. Continue
is not a promise to restore unfinished answers after reloading. Browser storage
restrictions may prevent remembering the location between visits.
