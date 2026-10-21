# Quality status — 19 October 2026

Scope: current theme repair batch and local quality gate.

Implemented: multilingual explanation of opening chord/pause/melody; live
playback phase messages; comparison-oriented retry feedback; level 3 changed
note location and level 4 pitch-direction questions; preserved note-position
label; focus identity restoration and next-stage focus; optional finish after
successful save.

Validation: build plus audio, piano, theme, full-audit, studio,
quality-regressions and quality-gate scripts passed. Gate behaviour was also
executed without --prototype and returned exit 2 (BLOCKED), as intended.
Independent teacher/test source review found no blocker for private prototype
publication; its two usability recommendations were implemented.

Limits: source and VM tests only. No real browser, rendered-audio analysis,
phone or assistive-technology verification. Focus has unit coverage, not proof
of rendered behaviour. Existing explored progress is retained; it is not a
claim of mastery of the revised higher-level tasks.

Pupil release: BLOCKED. Owner-private prototype: eligible for this update.
The local gate runs during packaging; it is not remote CI enforcement.
The release command records a content hash and base commit in
.quality/latest.json. All missing external evidence remains blocked.

## Phrase Puzzle follow-on batch

Added a new interaction family, in all three locales, with four labelled
variants: two fragments, three fragments, four fragments, and one repeated
fragment. It uses select-and-place controls, separate listening buttons,
whole-phrase/answer playback, clear-slot, completion and new-round controls.
Only the melody is played; no introductory chord. Current round is explicitly
not persisted or included in My practice.

New puzzle regression suite passes, including an exhaustive 81-arrangement
fixture for the repeated-fragment task and loading/Stop cancellation.
The existing suites still pass. Browser, rendered-audio and phone evidence
remain missing. This remains a private prototype, not a pupil-ready release.

## Notation Match follow-on batch

Added treble-clef score matching in three languages. Four levels use 3–6
notes, C-major pitch pools and 2–4 choices. The initial C4 is part of the
question; no introductory audio is added. Instructions explain omitted
barlines and equal quarter-note durations. Selection and checking are
separate actions. Optional text note names are disclosed as support.

Notation tests pass alongside existing suites. They verify staff pitch
coordinates and the middle-C ledger line, unique answers, exact scheduled
pitches, slow playback, fixed success and interrupted loading. Actual SVG
appearance, clef-font rendering, small-screen legibility, focus and phone
sound remain unverified. This remains private prototype development.

## Progress integration update

Supersedes the earlier temporary-progress limitation for Phrase Puzzle and
Notation Match: completed rounds and selected levels now persist and are
included in Export/Import. Unfinished questions still reset on reload.
The new practice suite covers repeat-credit prevention, sticky support,
first-complete-check results, reload, export/import, invalid-data rejection,
legacy-backup reset warnings and storage failure. Existing suites pass.
Browser/device verification remains blocked.


## 2026-10-20 — Compact toolbar
Replaced three persistent rows with one header row. On small screens the brand
name collapses to its logo; progress, sound, language and help retain labelled
46px controls. Sound and the three language links expand in mutually exclusive
panels; outside click/Escape closes them. Existing audio and storage handlers
are unchanged. Full automated gate passed before final icon polish and is run
again during packaging. Browser preview was attempted through the supported
Sites supervisor but browser access was denied by URL security policy. No
rendered/mobile or audible-device verification claimed; pupil release BLOCKED.

## 2026-10-20 — Theme 02: Find the groove

Added optional listening match, one-cell rhythm repair and creative rhythm grid.
All three languages; four bar/subdivision combinations; shared sampled piano.
Work is explicitly session-only and is not added to progress/export. Existing
saved data is unchanged. Home offers both themes without a linear prerequisite.
Independent teacher/test agent reviewed musical validity and interaction source.
It identified ambiguous repeated '&' accessible labels; these now identify the
beat (1 &, 2 &, etc.). No remaining source blockers reported. New groove suite
covers 80 generated rounds per level/locale, one unique matching option, one-cell
repair, listening completion gate, piano pitch/onset timing, leading/trailing
rests, twice playback, all-rest recovery, busy controls, Stop/navigation/stale
callbacks/loading cancellation and failed sample loading. This is source/VM
evidence, not actual browser/phone playback or pupil usability evidence.
Browser preview remains blocked by the previously observed security policy;
no bypass attempted. Pupil-release status remains BLOCKED. Final full gate runs
as part of private prototype packaging.

## 2026-10-21 — Theme navigation and return visits

Completed the interrupted header/onboarding update. Header offers Home,
previous/theme select/next and a compact tools menu containing practice, help,
sound and the full Språk links. Home offers Start here, Continue and Explore.
Navigation preferences are validated and saved separately from practice data;
there is no automatic ability placement or prerequisite. Continue restores the
chosen activity/level/mode, not a persisted unfinished answer. Groove work
remains session-only. Invalid or denied storage does not prevent practice.
Independent review caught repeated header replacement losing keyboard focus;
unchanged markup is now retained and focus restored after theme changes.
Navigation suite covers all locales, routes, level/mode reload, boundaries,
invalid storage, denied writes and interrupted audio. Browser/phone rendering
and real audio remain unverified; previous URL-policy denial is not bypassed.
Private prototype only; pupil release remains BLOCKED.
