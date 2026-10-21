# School administrator setup MVP

This is a development prototype. Pupil release remains **BLOCKED**. There is no
ZIP publisher or full application preview in this milestone.

## Use the separate Nynorsk setup page

Build with `python3 translate.py`, then serve the separate setup artifact:

```sh
python3 -m http.server 8001 --bind 127.0.0.1 --directory setup
```

Open http://127.0.0.1:8001/. The normal Nynorsk workflow asks only for school
name/logo, default language and optional accessible colour presets. All currently
implemented, prototype-eligible content and its levels are included automatically.
The supported target audience (11–13, with some musical experience) is informational;
there is no age-group choice or claim of broader age validation. Pupils continue
to choose activities and difficulty levels freely.

Exceptional restrictions remain under the initially collapsed **Avanserte
innstillingar** section. Imported/saved restrictions open this section and show a
clear restrictions notice. Closing it or editing branding does not change its
selections. Theme 03 and unknown/ineligible content cannot be enabled. Registry
flags distinguish implementation, prototype eligibility and pupil-release readiness;
missing flags or release FAIL exclude content. All current activities remain
pupilRelease BLOCKED even though they are available for private prototype testing.
Theme 02 remains session-only; eligible auxiliary activities remain available with their
configured levels, and the free workshop has only one setting.

The page runs locally without accounts, network services, analytics or pupil data.
It does not read/write pupil progress. **Lagre utkast her** uses a separate localStorage
key `musikkverkstad-school-draft-v1`; use **Last ned innstillingar** to keep the
portable settings JSON, including the processed logo. Import validates everything
before changing the form. Reset clears only the draft, never pupil progress.
If browser storage is denied, JSON download/import still works. Drafts belong to
this setup origin and should not be the school's only backup.

## Build a configured pupil version

The person maintaining the application supplies the exported JSON to the builder:

```sh
python3 translate.py --school-settings path/to/musikkverkstad-skule.json --output work/school-dist --no-admin
python3 -m http.server 8000 --bind 127.0.0.1 --directory work/school-dist
```

Node 24 validates the settings using the same contract as the setup form. Invalid
settings fail **before** creating/modifying the output directory. The builder embeds
validated configuration safely as data; school names are rendered with textContent.
All logo/audio assets stay local. Serving the pupil output folder exposes no setup
page/editor, and there are no administrator links or routes in the pupil app.
Keep `setup/` separate and never publish the whole development checkout for pupils.
Audio needs HTTP; `file://` use is not supported.

New settings default to all eligible prototype content. Earlier valid schema-v1
settings import/export unchanged, with their exact theme/level restrictions retained;
this UI change does not require a schema version bump or invent a new migration.
No-settings builds preserve the original default appearance and all original
content/levels. A configured build restricts both theme navigation and Start/Continue,
and checks difficulty changes in handlers as well as controls. Revoked/ineligible
registered activities are also removed from home/practice cards and rejected on
direct or restored navigation, without deleting historical progress. A saved unavailable
route/level recovers to an enabled choice. Historical counts, saved melodies and
backups are retained; archived Theme 01 reopening is disabled when its theme/level
is unavailable. Completed work can still be exported. No school settings are added
to the existing pupil progress Export/Import format. Theme 01's existing quick-entry
tab discoverability issue remains explicitly expected-failing in browser tests.

The selected pupil language takes precedence over the school's default when entering
index.html. Directly selecting a language still remembers that choice. Configuration
never resets language preferences or existing progress storage keys. Changing the
host/port still creates a different browser origin, as before.

## Settings contract and safety

Schema version 1 is unchanged from the earlier Phase 2 setup and has these fields:

- `schemaVersion`: 1.
- `schoolName`: plain text, up to 100 characters, no control characters.
- `logo`: null or a bounded, processed PNG data URL; never a remote URL or SVG.
- `defaultLanguage`: nn, nb or en.
- `colourPreset`: original, blue or gold. No arbitrary CSS.
- `ageGroups`: currently only the nonempty selection ["11-13"].
- `themes`: a nonempty subset of stable IDs theme and groove.
- `levels`: all eight registry entries, each a nonempty subset of its implemented
  levels. Theme/auxiliary activities have four settings; create has only [1].
  The three modes inside a theme share its difficulty selection.

Unknown fields, unsupported schema versions, unavailable content, duplicates and
empty/invalid selections reject rather than silently enabling content. Disabled
themes retain valid level selections for later re-enabling. The shared registry
is src/school/config.js; adding labels does not implement curriculum. There is no
older released school schema to migrate yet. Future schema changes must add an
explicit migration or clearly reject unsupported versions without mutation.

Uploads accept PNG/JPEG/WebP only: max 512 KiB, width/height at most 2048 and at most
4 million pixels. Validate header dimensions before native decoding, then recheck
decoded dimensions and re-encode to a maximum 256-pixel PNG. JSON imports re-decode
and re-encode logos as well. No original metadata, active SVG/HTML or external image
URLs are retained. Settings logos must be canonical noninterlaced 8-bit RGB/RGBA
PNGs: shared validation checks chunks/CRC and the build checks compressed pixel
lengths and scanline filters. The setup page's CSP denies network connections. Settings JSON
has a 450 KiB limit and processed PNGs have a 300 KiB decoded-file limit.

## Quality and limitations

The full development gate runs all original regressions plus school contract tests
and actual desktop/mobile Chromium tests. Browser fixtures are real school builds,
covering both theme subsets, all locales, free level selection, fallback navigation,
language preference and progress preservation. Administrator tests cover native image
processing, download/reimport, rejected inputs and denied storage.

The gate rebuilds the default `dist` and `setup` artifacts, hashes both, and tests
representative configured fixtures. It does **not** approve every arbitrary school
output directory or transfer evidence from the base app to customised bytes. Use a
separate output as above; do not assume running the default gate after a custom build
to `dist` preserves that customisation. Exact-output evidence/adapters and publishing
remain future milestones. All release-evidence requirements remain intact/BLOCKED;
prototype gate success is not pupil-release approval. Physical-device/speaker, Safari,
assistive-technology and real pupil validation are not established by these tests.
