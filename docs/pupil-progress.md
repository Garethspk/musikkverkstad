# Phase 3 progress and navigation

Theme 01's existing activity/level cards now appear on welcome and quick screens as
well as Explore. A mode choice opens that mode immediately; it does not require
listening or completing another mode. The compact header/styles are retained.
Exactly the existing quick-entry expected-failure marker is removed (one case in
each viewport); the original requirement now passes normally.

## Theme 02 contract

Existing main storage key `musikkverkstad-v1` and backup version 1 stay unchanged.
The optional `groovePractice` extension has its own version:

```json
{"version":1,"level":2,"done":{"listen-2":1,"repair-2":3},"creations":[{"level":2,"pattern":[1,0,1,0,1,1,0,0]}]}
```

- `level` is a selected challenge 1–4, never automatic placement.
- `done` holds only listen/repair keys for levels 1–4, with integer counts 1–1000000.
  A successful round counts once, including after repeated checks or route changes.
  Listening still requires the reference and both alternatives to finish playing.
  No score, first-attempt claim or mastery judgement is inferred.
- `creations` holds at most 20 explicit saves. Each contains exactly a valid level
  and a binary note/rest pattern of 4, 8, 8 or 16 cells for that level. At least one
  note is required; duplicate level/pattern saves do not add entries. Leading/trailing
  rests remain valid and playback timing is unchanged. Creations may be reopened
  in the creative grid; there is no aesthetic correctness judgement.
- Unknown versions/fields, invalid counters/cells/dimensions and oversized collections
  reject. No name, identity, timestamp, microphone or remote storage is added.

My practice shows completed listening/repair counts by level and saved rhythms.
It retains valid historical achievements even when a school disables Theme 02 or
particular levels. Reopen buttons and action handlers both enforce school availability;
disabled history remains exportable. Saved unavailable levels recover to an enabled
level on activity entry without rewriting historical selected-level/creation records.

## Compatibility and recovery

Older local version-1 data without `groovePractice` gets empty Theme 02 history in
memory; all previous activities and Theme 01 storage remain unchanged. The next
successful save writes the extension. New backups include it through the existing
Export button. Import validates the complete main progress and Theme 01 extension
before mutating either. An unsupported/corrupt Theme 02 or Theme 01 payload rejects
without partial progress changes. Existing confirmation before replacement remains.

Older backups without Theme 02 retain the current Theme 02 history, matching the
existing policy for absent Theme 01 data. Backups with the extension replace it on
confirmed import. Existing legacy-extraPractice confirmation/reset behaviour remains.
Language preference keys and per-origin storage are unchanged. Unfinished round
questions, guesses, listening flags and partial edits are **not** in the backup.
Continue reopens an activity/level with a fresh question; it is not a resumable round.

If storage is denied or full, work stays available in memory, a translated warning
asks the pupil to export, and the real JSON download still includes that work.
If previously stored main progress is corrupt/unsupported, its raw bytes are protected
from automatic overwrite while new practice is temporary. Only explicit confirmed,
fully validated import replaces the damaged record. A malformed import never clears
that protection. No automatic deletion/reset or silent data salvage is performed.

## Verification boundaries

Node tests use the existing simulated DOM/audio to test state, migrations, atomicity,
one-credit rules, data bounds and storage faults. They are not browser/device evidence.
Actual Chromium tests exercise all three languages, keyboard/viewport activity access,
refresh, language navigation, UI-completed repair, creative saves, downloaded/reimported
backups and school subsets. Browser storage fault tests deliberately inject denied/quota
errors; they do not establish real device capacity. Original native-audio, cancellation,
configured ZIP and isolated-preview checks remain part of the full gate.

Local managed Chromium still blocks file:// setup navigation, so those two enabled
standalone tests fail before execution locally; GitHub Actions verifies them in its
matched browser. See docs/pr-5-verification.md. No policy bypass, skipped assertion or
pupil-ready claim is added. Physical-device/audio-speaker and version-bound release
reviews remain unavailable; pupil release stays BLOCKED even when CI passes.

## Issue16 — visual Form maps

The unchanged main storage key/backup version optionally contains `formPractice`
version1: selected configuration, puzzle/build practice counts by configuration and
up to20 saved `{level,map,previous}` maps. All2–6bar maps over A/Av/B/Bv are valid
creative saves; there is no aesthetic or hearing score. Before-version is optional
and may have a different supported length. Exact bounds/relationships are in
[the Form design](form-design/README.md).

A missing extension in an older confirmed backup preserves newer current Form
work. An explicit validated extension replaces it after confirmation; invalid data
rejects atomically. Existing Theme01/02 work and language keys are retained. A
confirmed import resets temporary editor state; ordinary mode/configuration/brief
changes preserve the session creation/before-version. Only explicit saves survive
reload/language navigation. Disabled Form/configurations cannot reopen work, but
valid history stays exportable. Denied storage retains work in memory for export;
damaged stored bytes are protected until explicit valid replacement.

Node Form tests use simulated DOM/storage. Chromium checks verify actual diagrams,
text/keyboard/touch/viewport use, backup files and school restrictions; they do not
establish real assistive-technology, device, teacher/pupil learning or instrumental
transfer. Form completes without AudioContext or sample requests; it is a visual
objective, not missing auditory evidence. Required unrelated audio/release checks
remain intact, and pupil release remains BLOCKED.
