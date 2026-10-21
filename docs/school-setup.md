# School configuration, preview and prototype ZIP

This is a development prototype. Pupil release remains **BLOCKED**. The browser can now preview the actual
configured pupil files and download a complete ZIP for **private prototype review**.
This is not permission to publish to pupils.

## Use the separate Nynorsk setup page

**Validation scope:** CI checks the real standalone setup and extracted pupil ZIP.
Local managed Chromium policy prohibits file://, so those two tests remain locally
unavailable/failing; they are never skipped or relabelled PASS. The intermittent
preview-to-download test was traced to scroll/compositor input timing in alternate
local Chromium and now waits for rendered scroll before the same native pointer
input. See [PR #5 verification](pr-5-verification.md) and the PR's exact check results.
No physical device/speaker or pupil-release approval is implied.

The intended school workflow needs only the trusted `setup/index.html` file: save it locally and
open it in a current Chromium browser (Chrome/Edge). No Python, Node, account or
Internet connection is needed for configuration, preview or ZIP download. Keep this
file separate from pupil hosting. The `setup/template.json` build output is for
maintenance inspection; the standalone HTML already embeds the complete template.

Maintainers regenerate it with `python3 translate.py`. It can also be served locally:

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

## Preview and download (school workflow)

1. Enter school name/logo, language and optional colour preset. Leave the advanced
   section closed unless deliberate restrictions are needed.
2. Select **Førehandsvis elevappen**. Try the actual pupil application, including
   language switching and audio. **Stor skjerm** is 1100 × 760 and **Mobilvising**
   is 390 × 844; these are browser viewports, not physical-device evidence.
3. Select **Last ned prototypepakke (ZIP)**. This uses the same verified candidate
   as preview. Any settings edit discards the old preview/candidate. The displayed
   identity matches `school-package.json` in the download.
4. Extract **all** files. Give the folder to the school's website maintainer for
   **private** static HTTP/HTTPS hosting and read `PUBLISERING.txt`. The pupil app
   needs HTTP audio; double-clicking its HTML is unsupported. Website hosting is
   a separate responsibility, with no deployment performed by the configurator.
5. Keep `school-settings.json` for the next application update. Import those settings
   into the new trusted configurator, preview again and download a new candidate.
   Never import or execute an old pupil ZIP. Unsupported schemas/content reject
   without changing the current form; existing valid v1 restrictions are retained.

The preview adds only an internal transport/storage/navigation adapter to the same
candidate pupil HTML. Its iframe has an opaque origin, `sandbox="allow-scripts"`
only, no parent DOM/admin access and temporary in-memory pupil storage. Its connection
policy remains `connect-src 'none'`. The adapter supplies the exact verified local
MP3 bytes through native Responses to the original native audio decoder; it makes
no HTTP requests or simulated audio results. Exported pupils use normal HTTP fetch
without this adapter. Language links use a source/origin/nonce-checked, locale-only
message; language changes start a new temporary preview session. All other links
(including progress downloads) are disabled in preview. Close/regenerate destroys
the iframe; no preview asset Blob URLs are created. JSON/ZIP download URLs are revoked.

No preview progress is copied into the ZIP or real pupil storage. Existing pupil
preferences/progress are preserved when the extracted app uses their existing
browser origin. Preview cannot establish physical speaker output, phone or Safari
compatibility, accessibility approval or pupil suitability.

## Maintainer alternative: build configured pupil files

Maintainers can still supply the exported JSON directly to the same builder:

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

The gate rebuilds default `dist` and `setup`, checks all regression suites and
runs real Chromium tests. Package tests validate template corruption, unsafe paths,
size limits, JSON/logo validation, deterministic ZIPs/CRCs and exact CLI/browser
pupil-byte equality. Browser tests download the real ZIP, extract/serve it, check
three locales, branding/restrictions, no editor, native MP3 decoding, viewport sizes,
opaque preview storage, rejected network access and invalid input.

The base template is generated from one positive allowlist in
`src/school/package-policy.json`; it includes four pupil HTML files, five MP3s and
credits. Export adds settings, publishing instructions and candidate manifest. The
historical sound-comparison demo, administrator, preview adapter, tests and tooling
are excluded. Settings are injected only into one inert JSON slot; pupil application
code is unchanged across schools. School logos stay embedded locally.

The configurator pins the raw template SHA-256, verifies exact paths/sizes/hashes
and validates settings again before preview/export. ZIP generation uses a small,
fixed STORE-only writer, UTF-8 names, fixed timestamps and CRC32; there is no ZIP
input parser or third-party ZIP runtime. Current compressed MP3s are already small;
this deliberately trades ZIP compression for fewer dependencies and attack surfaces.
The source hash is reproducible across commits and includes build/source bytes.
The settings hash covers canonical JSON. The candidate hash covers canonical
manifest metadata and sorted payload path/size/SHA-256 records (excluding the
manifest itself to avoid circular hashing). These identities detect mismatches;
they are not digital signatures or proof that untrusted software is authentic.

All candidates are forced to `pupilRelease: BLOCKED` and
`purpose: private-prototype-review`, with explicit limitations. A modified candidate
fails verification. Neither successful ZIP generation nor the default gate approves
every arbitrary school output or transfers base release PASS. Exact-output
release-evidence adapters remain future work. Required browser/rendered-audio/device/
independent-review evidence gates are intact. Physical-device/speaker, Safari,
assistive-technology and real pupil validation are not established by these tests.
