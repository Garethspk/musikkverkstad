# Issue #25 — Week 2 implementation (draft review)

[Week 2 design, compatibility and Week 3 follow-up](docs/week-2/README.md) extend
consolidated main `ae03deb` with Form detective, Melody contour and Practice-plan
challenge. Three independently accessible 3–5-minute activities share the existing
weekly programme architecture. School schema6 remains unchanged; both weeks obey
programme consent/levels, and Form detective also respects enabled Form1/4.
A separate optional Week2 archive preserves older-backup/module independence.
[Four critical non-human reviews](docs/week-2/reviews.md) distinguish automated
evidence from human validation, which remains PENDING. Pupil release BLOCKED; no
merge, deployment or distribution. Week3 is documented only, with no enabled shell.
Exact tests/CI and remaining limitations are recorded in the new draft PR. Earlier
milestone snapshots below are historical; their branch/availability limits are not
the current consolidated implementation.

# Issue23 — combined integration (draft review)

The [current integration contract and schema6 matrix](docs/integration-23/README.md)
reconcile exact PR15 `e451194` and PR22 `e48480d` with main `8af7a24`. This is a new
integration branch; neither original PR nor main is merged or modified. Theme01/02,
Conversation, auxiliary Form and only Week1's three tasks coexist without changes
to their musical predicates. Versions1–5 have independent historical readers; absent
content stays disabled and explicit restrictions/branding/levels survive. Optional
archives preserve missing newer work independently and reject invalid imports atomically.
See [four independent AI reviews and evidence limits](docs/integration-23/reviews.md).
Human educational/TA1–TA5/AT/speaker/device/pupil validation PENDING; pupil release
BLOCKED. Exact candidate tests/CI belong in the new draft PR. No publishing,
deployment, staff contact or pupil distribution. Weeks2–6/52-week banks remain future.
Earlier branch-specific availability/schema statements below are historical and
superseded by this combined contract, not current restrictions of this branch.

# Phase0 review gate before weeks2–6

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

# Issue16 — visual musical form vertical slice

The authorised [Formverkstad design](docs/form-design/README.md) supplies graphical
puzzles, construction and ungraded map revision using a small explicit musical
palette. It is a visual objective; no listening test validates or unlocks it.
The activity is separate from the two numbered themes and draft PR15.
[Integration obligations](docs/form-design/integration.md) must be reviewed before
combining the drafts; neither is merged by this work.

After implementation review, seek actual teacher/pupil feedback on one3–5minute
form-map exercise: explain repeat/contrast/return/variation, independently operate
keyboard/touch/text alternatives, revise a map and optionally transfer a relation
to an instrument. Check TA1–TA5 teacher adoption separately from visual correctness.
Human educational/access/device/adoption evidence remains PENDING; pupil release
BLOCKED. Do not infer auditory recognition or musical quality from pattern success.

# Musikkverkstad roadmap

## Curriculum architecture gate — Issue #10 (proposal for review)

Before further Theme 03 expansion, review the [curriculum decision memo](CURRICULUM_DECISION_MEMO.md), [year framework](docs/curriculum/year-framework.md), [research/access record](docs/curriculum/evidence-brief.md), [activity template](docs/curriculum/activity-template.md), [quality/review criteria](docs/curriculum/quality-review.md), [Theme 03/Echo adjudication](docs/curriculum/theme03-adjudication.md) and [independent model critiques](docs/curriculum/specialist-critiques.md).

Proposed direction: four recurring musical families, a flexible year spiral and four freely selectable configurations per activity. Retain Echo provisionally as a narrow reusable component, not completion of broader musical conversation. PR #9 remains draft and unmerged; its corrected examples are pinned references, not merged content here. Human musical/learner/device evidence and owner design approval remain pending. This documentation does not implement, enable or validate future themes, alter school publishing or authorise expansion. Pupil release remains BLOCKED; existing release requirements are intact.

## Phase 1 — Development reliability (merged; CI passed)

Repair the development gate without fabricating Work hosting configuration;
run all 13 Node suites; add desktop/mobile Chromium interface and native-audio
checks; provide reproducible CI and explicit evidence limits. Keep pupil release
BLOCKED until its required evidence is available. See
[development-quality.md](docs/development-quality.md).

## Phase 2 — School setup MVP (merged)

The first increment now provides the separate Nynorsk setup page, shared settings
schema/registry and pupil loader described below. See docs/school-setup.md for
operation. The schema/registry, settings JSON import/export and pupil loader are
implemented. No new curriculum is included.

## Phase 2B — Prototype package and preview (implemented; review pending)

The separate standalone configurator now previews the same verified candidate files
and exports a complete pupil ZIP in the browser. All output remains a private
prototype with pupilRelease BLOCKED. An opaque allow-scripts-only iframe uses
transient storage and a local sample-byte transport with connect-src none; the
exported app has no preview adapter or editor. Desktop/mobile are viewport checks.
See docs/school-setup.md for hosting/update instructions and evidence limits.
The local browser verification discrepancies are explained in
[PR #5 verification](docs/pr-5-verification.md); file-policy failures remain visible.

The implementation simplifies the original embedded-ZIP/library proposal below:
a pinned inert allowlisted file map feeds a deterministic STORE-only ZIP writer.
There is no archive parser or external ZIP dependency. This preserves the manifest,
positive allowlist and integrity boundaries with fewer moving parts. Settings are
replaced only in the explicit inert JSON slot, never arbitrary executable source.
Exact-candidate pupil-release adapters remain pending. Next implement those evidence
bindings before pupil-ready publishing (the entrance issue is resolved in Phase 3);
major curriculum expansion remains a later priority.

## Phase 3 — Pupil navigation and progress (implemented; review pending)

Theme 01 exposes all three activities on every entrance. Theme 02 saves completed
listening/repair rounds and explicit rhythm creations, with a versioned extension
of existing local progress/backups. See docs/pupil-progress.md. School restrictions
filter reopening without erasing history; no incomplete-question resumption is
promised. Audio, package isolation and release gates are unchanged. Exact-output
release evidence and physical-device/speaker review still precede pupil publishing.

## Delivery priorities

1. Complete the current reliability and automated-testing work, including any
   remaining validation and CI follow-through. Roadmap updates do not interrupt
   or replace that work.
2. Implement the separate administrator setup and school distribution workflow
   for existing content, in the increments below.
3. Begin major curriculum expansion only after the setup/distribution foundation
   is working and its quality boundaries are established. Required reliability
   fixes and release-evidence work continue throughout.

## Architecture decision — school-specific downloadable distribution

**Accepted direction; settings and private-prototype export implemented. Pupil-ready publication remains blocked.** Schools will configure a local
publishing package through a separate, nontechnical browser-based administrator
setup tool **before publishing it for pupils**. Schools receive a downloadable
application package, configure their version and publish the resulting static
pupil package. Administrator setup follows Phase 1 and precedes major curriculum
expansion. This roadmap update changes no application behaviour.

### Principal workflow decision — review of PR #3

The main setup workflow is administrative: school name/logo, default language and
optional colour presets. Automatically include all currently implemented and
prototype-eligible content/levels. Show the supported 11–13 audience as information,
not a principal's age-group selection or evidence of wider age validation.
Exceptional theme/level restrictions remain in collapsed **Avanserte innstillingar**;
valid older imports keep their deliberate restrictions, which are clearly shown.
Keep stable IDs/schema validation and the distinction between prototype availability
and pupil-release readiness. This decision supersedes earlier roadmap wording that
put pedagogical checklists in the main form. Administrator setup remains ahead of
major curriculum expansion; prototype ZIP/preview are implemented in Phase 2B; exact-output pupil release remains pending.

### Recommended implementation

Keep the pupil application as a static, multi-file website. Ship a ZIP containing
its HTML pages, bundled piano samples/credits, approved school logo, a small
versioned school-settings file and local branding assets. “Self-contained” means
all runtime dependencies are in this package, not one HTML file. A school extracts
the ZIP and serves it on its own static web host; `file://` audio is not supported.
A school can run the same folder with a local HTTP server. Service-worker/offline
installation is a separate future capability, not an implied feature of ZIP export.

Maintain **one reusable configurator**, separate from pupil source/runtime routes.
It needs no accounts, database, analytics or server-side processing. Do not fork
the application source for each school and do not generate customised JS/HTML by
string replacement. Add a small shared settings loader to the pupil application
in the implementation phase; use validated data to set text, logo, a restricted
CSS-variable palette, default language and permitted age-group, difficulty-level
and theme IDs. Invalid/missing configuration must have documented safe defaults
and cannot enable hidden content.

The setup interface should offer:

1. School branding: school name and local logo upload, with clear Remove/reset actions.
2. Default language: Nynorsk, Bokmål or English. Preserve the pupil language
   selector; a valid saved pupil preference takes precedence over this default.
3. Optional school colours: offer accessible presets and bounded custom colour
   inputs for a small set of fixed palette tokens. Validate every supported
   foreground/background pair and reject insufficient contrast. Keep the original
   palette as the default. Never accept arbitrary CSS.
4. Informational supported age groups from implemented content metadata; no main-form selection.
   The existing audience is ages 11–13; do not invent younger/older content or
   imply that adding an age label implements or validates it. Further groups
   remain unavailable until their content and suitability have been reviewed.
5. Optional advanced difficulty restrictions per activity/theme, selected from levels that
   actually exist. Present their descriptions and provisional nature clearly;
   do not assume every activity has four levels or that numbers mean the same
   thing across activities. Require a nonempty valid selection for enabled content.
6. An optional advanced checklist of themes with plain-language implementation/release
   status. Initially only Theme 01 and Theme 02 exist. Theme 03 and other planned
   content must be unavailable for inclusion, never labelled complete. Require at
   least one selected theme. Explain that unfinished Theme 02 rounds are temporary; completed practice and saved rhythms persist.
7. Desktop/mobile preview buttons using the **same generated pupil files and
   settings** as export, not a separate mock UI. Label mobile preview as a viewport,
   not proof of phone compatibility.
8. Save settings, Import settings, and Export school package. All processing stays
   in the browser. Clearly explain where files are downloaded and what each contains.

**Pupil choice is preserved.** Schools define which content and levels are
available; pupils freely select and change an appropriate difficulty level within
that enabled content. A school default or a nonbinding suggestion must not become
a forced placement, prerequisite, completion lock or automatic promotion. Age
groups describe the available content, not an individual pupil profile: no name,
date of birth or personal age collection is needed. Theme numbers do not rank ability.

Age-group, difficulty-level and theme availability must come from a maintained,
stable-ID content registry used by both pupil navigation and the configurator. Filter home cards, previous/next,
Start, Continue and restored navigation consistently; redirect a remembered disabled
route/level to an available choice. Validate the intersection of selected age
groups, themes and per-activity levels: reject combinations that leave no usable
content, and explain incompatibilities before export. A visibility flag is not
a security boundary. Keep auxiliary activities available under an explicitly documented policy. A theme
subset must not silently delete existing pupil progress. Branding/default-language
updates must preserve existing storage keys and valid progress migrations.

### Browser ZIP generation and preview

The simplest robust release artifact is a **separate self-contained configurator
HTML file with an embedded, inert copy of the approved base pupil ZIP**, its manifest
and a pinned, locally bundled ZIP library (for example fflate, preserving its
license). This works without a backend, CDN, cross-origin fetch or opening a local
ZIP URL. The larger configurator download is a deliberate tradeoff for a simple,
consistent school workflow. Do not embed the configurator in the pupil ZIP.

Generate the embedded base ZIP automatically in the normal build/quality pipeline;
never maintain a second handwritten list of application files. Its manifest records
application version, settings-schema range, stable implemented age-group/theme/
difficulty IDs, asset paths/hashes, exact template hash and release status/evidence provenance. Verify
the embedded template's expected SHA-256 with Web Crypto before customising it.
This detects mismatched/corrupt templates; it is not a substitute for authentic
software distribution or a release-quality decision.

On Export, validate settings, copy only allowlisted template entries, add validated
school settings and the processed logo, then create the ZIP entirely in memory
using the bundled ZIP library. Download a Blob using an object URL and revoke it
after use. Never execute ZIP entries or inject school values into scripts/HTML.
Reject absolute paths, `..`, backslashes, duplicate entries, unlisted files, excessive
entry counts and uncompressed-size limits. Bound input/output sizes so an archive
or logo cannot exhaust memory. The normal setup path accepts settings files, not
arbitrary application ZIPs; any future template-import feature needs the same
manifest/integrity/version checks and stronger archive validation.

For the logo, initially accept PNG/JPEG/WebP only, with file-size, decoded-dimension
and pixel-count limits. Decode and re-encode to a bounded PNG using a canvas,
removing metadata and preventing SVG/HTML/script content from entering output.
No remote image URLs or unsanitised SVG. Validate the school name as bounded plain
text and render it with `textContent`; use generated safe filenames, not user paths.

For preview, use a disposable sandboxed iframe running the actual pupil app.
Build an in-memory file map from the same export inputs, map local resources to
Blob URLs and resolve local piano fetches through a small **preview-only** adapter.
Keep that adapter inside the setup tool, never in export. Use an opaque-origin
sandbox with scripts enabled but without same-origin, top-navigation or popup
privileges; restrict CSP/connect targets to the mapped local resources and do not
use `eval`. Use a narrow, validated message protocol if communication is needed.
The preview must not read/change real pupil localStorage; provide temporary preview
storage in its adapter. Revoke all old URLs on regenerate/close. Prototype this
preview first: if opaque-origin audio/asset handling becomes complicated, use an
explicit local-HTTP setup distribution with a dedicated preview path rather than
weakening the sandbox or producing a visually similar but different preview.

The **pupil ZIP uses a positive allowlist**: application files, required audio and
credits, school settings/logo, manifest and school publishing instructions only.
Exclude configurator HTML, setup scripts, preview adapters, ZIP libraries, admin
routes, development dependencies, test fixtures and tooling. Inspect ZIP contents
and serve the final extracted artifact in tests. Confirm there is no reachable
configuration interface. This requirement does not promise that a school cannot
manually edit static files; it removes an administrator editor from pupil use.

### Saved settings and compatibility with updates

Save a versioned JSON settings file containing `schemaVersion`, optional school
identity/version metadata, school name, language, colour tokens, stable age-group
and theme IDs, per-activity permitted difficulty IDs/defaults and the bounded
processed-logo data. This preserves the logo without external
files/URLs or requiring a second settings ZIP. Exclude pupil progress entirely.
Use strict validation and explicit migrations, independent of application version.
Reject unsupported future schemas without mutation. On an updated configurator,
import the saved settings into the **new trusted template**, not an old pupil ZIP.
Report renamed/removed age groups, themes or levels and require a new valid selection; never silently
substitute curriculum or enable newly added themes. Keep the previous settings
file untouched until the school explicitly saves the updated copy.

### Compatibility with release-quality gates

Every selected age-group/content/difficulty combination must be implemented,
tested and eligible for the chosen output status. Keep implementation, automated-test coverage and pupil-release readiness
as distinct registry states. The tool must not provide a control that changes
FAIL/BLOCKED into complete/pupil-ready. The current base remains a private prototype;
any currently permitted prototype export must carry that status and limitations.
School publication-ready export remains unavailable while required evidence is
missing. Schools cannot turn on Theme 03 by editing a checkbox or imported JSON.

Customisation changes the candidate bytes: **do not copy the base release PASS as
if it approved the customised ZIP**. Record parent template hash, schema/settings
hash and deterministic output-content hash. Preserve the quality report and evidence
requirements. Before pupil-ready publishing is enabled, provide a gate/adapter that
verifies the exact generated candidate, including allowed transformations, selected
content, colour/accessibility constraints, branding and browser/audio checks. Evidence
must bind to that candidate identity. A browser-only configurator cannot claim it
has run CI, phone tests or independent review. If exact-output evidence cannot be
obtained, retain BLOCKED rather than offering an override. Downloading a labelled
prototype for review is distinct from approval to publish it to pupils.

### Implementation sequence and acceptance criteria

1. Finish Phase 1 and establish explicit release evidence/version handling.
2. Add stable age-group/theme/per-activity difficulty registry and versioned
   settings schema/validator/migrations; test malformed, legacy and unsupported
   settings, unavailable content and incompatible or empty selections.
3. Add the shared pupil settings loader and route filtering without changing
   activity logic; verify all locales, saved progress, disabled-route/level recovery
   and free pupil difficulty selection within school-enabled content.
4. Build the separate setup UI for branding/logo, language, school colours,
   age groups, difficulty levels and themes, including safe logo processing;
   test keyboard use, reset/import/export and offline/local-only asset handling.
5. Generate the trusted template, ZIP exporter and isolated desktop/mobile preview.
   Ensure preview and exported files derive from the same settings and file map.
6. Test exported ZIP contents and the actual extracted pupil app across locale,
   age-group/theme/difficulty-subset and branding cases; verify no editor or remote runtime assets,
   complete audio/license files, no pupil data and reproducible content hashes.
7. Test reimport against a newer app/template and release-gate fail/BLOCKED paths.
   Obtain the missing rendered/device/review evidence before enabling pupil-ready
   publishing. Document school hosting and update/backup procedures.

Do not expand to new themes as part of the configurator work. Theme 01's visible
activity entrances and Theme 02 persistence remain separate application priorities.

### Recommended next task after Phase 1

**Implement a school-setup MVP for existing content:** a versioned settings and
content-registry foundation, a separate nontechnical settings form, and the pupil
settings loader. Deliver this as a bounded development-prototype increment before
building the ZIP exporter and full preview workflow. Do not start new curriculum
or imply that this increment alone is a school-ready publishing release.

Acceptance criteria:

- The form supports school name, safe local logo upload/removal, default language,
  validated school colour tokens/presets, and available age groups, per-activity
  difficulty levels and themes. All controls have plain-language labels and
  usable keyboard focus; the original appearance remains the default.
- Options derive from a single versioned registry of actual implemented content.
  Only the current supported 11–13 audience is offered initially; Theme 03 and
  unsupported age groups/levels cannot be enabled through UI or imported JSON.
  Content implementation/test/release status remains explicit.
- The pupil app applies valid settings consistently across all three languages,
  home/navigation/Start/Continue and activity-level controls. Pupils can choose
  and change every school-enabled difficulty; disabled choices stay unavailable.
  A remembered disabled level/route recovers to an enabled choice without losing
  valid progress. No pupil identity or individual age profile is collected.
- Settings save/reimport round-trips the processed logo and all selections.
  Strict schema validation rejects invalid, empty or incompatible selections,
  unsupported schema versions and unsafe assets without partially mutating the
  current configuration. Supported older settings migrate explicitly.
- The setup interface is a separate artifact with no administrator route or editor
  added to the pupil runtime. Processing and assets stay local; no accounts,
  database, analytics or pupil-data transmission are introduced.
- Extend the existing Node and real-browser checks for settings validation,
  switching languages, restricted navigation, free difficulty choice, storage
  recovery and settings round-trips on desktop/mobile viewports. Keep all existing
  regressions passing and pupil release BLOCKED until required evidence exists.
- Document the settings contract and the follow-on work: actual-file desktop/mobile
  preview, allowlisted ZIP export, extracted-package tests, and version-bound
  release evidence. No publishing control claims these later capabilities are
  complete in the MVP.
