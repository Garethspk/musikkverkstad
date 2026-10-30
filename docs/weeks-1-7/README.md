# Seven-week prototype integration

This separate development trial integrates the **seven uploaded authoritative HTML
prototypes**, all 21 activities. It does not replace the existing six-week application,
its school schema6 configuration, backups, teacher kit, release gates or pupil storage.
No deployment, publication or pupil approval is included. Human validation **PENDING**;
pupil release **BLOCKED**.

## Build and open

Use Node24, Python3 and `npm ci` for development. Run:

```
npm run build:seven-weeks
```

The result is `.quality/weeks-1-7/musikkverkstad.html`. This is the **only file needed**
by a tester: save it locally and open in Edge/Chromium. All CSS, scripts, examples and
Web Audio synthesis are bundled. No server, installation, sample download, accounts,
analytics, microphone or network requests are needed. A managed browser can prohibit
local HTML; see the verification report. Do not disable a school's browser policy.
The accompanying `source-manifest.json` records the artifact SHA256 and all originals.

The original seven files remain unchanged in `latest-week-prototypes/`; `SHA256.json`
pins the uploaded bytes. The builder rejects mismatched sources. The migration matrix
maps all activities to original functions, integration corrections and native tests.
The source modules are build inputs, not a second runtime deployment.

## Trial progression and privacy

All seven weeks are freely selectable. Within each week tasks unlock sequentially;
Next requires genuine task completion. Completed flags last only in the open tab.
Changing week resets unfinished rounds and arrangements. Previously completed work is
labelled explicitly; answers and creative drafts are **not** recovered. Switching
language retains the active task state and cancels sound. Reset confirms before
clearing all trial flags and returning to Week1. Closing/reloading clears the trial.
No legacy pupil data is read, written, migrated or cleared. This is not yet the school
publishing application: it does not import or apply existing school restrictions.

## Security and sound

One opaque `sandbox="allow-scripts"` frame is mounted at a time; no same-origin access,
popups, navigation, form submission or downloads are granted to activity frames.
Parent/child messages require the active window and session, with typed sequential
completion flags. Content Security Policies block remote connections and resources.
No iframe is allowed to read parent data. Week switches wait for native audio stop
acknowledgement before replacing the frame. Language, edits, hidden pages and Stop
invalidate pending audio and stale question callbacks.

Real Web Audio playback completion uses the audio clock, not merely a timer or click.
Week1 exposes a real repeat loop; Stop after a complete cycle advances once, immediate
Stop earns nothing. Week6 loop is deliberately unavailable with a translated
explanation: each stage needs a single complete audition. Week7's supplied v1 has no
loop control, so none is invented. None of these checks proves audible speaker output.

## Intentional corrections and limits

- Correct C4/D4 staff positions in Week2 and reset-before-render in Week3.
- Preserve Week4 any-order chord selection. Name exact octaves where two keyboard
  keys share a pitch class; hearing credit requires completed current playback.
- Week5 retains the original pitch and q→paired-eighths→rest controls. Notated and
  sounded eighth pairs now share the diatonic successor (including E→F and H/B→C).
  Return/reconstruction banks avoid immediately repeating the same example.
- Week6 keeps the full multi-note layer banks, distinct sine/saw/square timbres,
  four-beat arrangements, meaningful comparison and automatic final completion.
- Week7 compound6/8 accents group3+3 with eighth subdivisions, rather than4+2.
  Three quarters and six eighths have equal bar lengths; final grids remain visible.
- Shared navigation/header replaces duplicate source toolbars. Cards, musical controls,
  help, visual design and authentic activity mechanics remain prototype-derived.

NN/NB/EN strings and musical data have automated and non-human AI inspection.
Natural-language quality, teacher usefulness, physical touch/keyboard/AT use, audible
balance and pupil suitability still require people. No weeks8–52 are implemented.

## Verification

```
node tests/seven-weeks.cjs
npm run test:seven-browser
node scripts/quality-gate.cjs
```

Install the normal Playwright Chromium with `npx playwright install chromium`, or use
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` where already installed.
The separate suite keeps30second individual bounds and **zero retries**. It runs
Chromium desktop and Android-tablet **emulation**, not physical Android evidence.
The existing development gate discovers the new Node suite; a separate CI job runs
the new native browser suite without removing any older checks. CI uploads its JSON
report only, not the playable HTML or source-containing browser traces.

Native task tests use seeded prerequisite flags and selected intermediate stages to
isolate a particular activity within30seconds. Audio remains actual Web Audio; no
fake completion is passed off as playback. This is not one unseeded21-task pupil
walkthrough. Node VM checks are explicitly **simulations**, not browser evidence.
See `verification.md` for exact observed results and the all21task checklist.
