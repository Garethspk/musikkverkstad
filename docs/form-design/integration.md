# Issue16 integration and PR15 separation

This branch starts at main `da129a711e196adf97e742fa6a5ac74382e96977`.
PR #15 remains a separate unmerged draft. No commit or source file is cherry-picked
or extracted from it. The new files are `src/form.js`, `src/form.css`, independent
unit/browser tests and this design/review record.

## Unavoidable shared hooks

- `src/app.nn.html`: optional progress validator/default, home card, render route,
  practice archive and confirmed-import preservation/reset.
- `src/navigation.js`: auxiliary `form` route and mode/level Continue. Existing
  Theme01/02 indexing, previous/next and theme-selector counts stay unchanged.
- `src/school/config.js`, `pupil.js`, `admin.html/js`: registry, own availability
  flag/levels, migration, route filtering and advanced administrator controls.
- `src/school/package.js`, `translate.py`: supported template schema, inject Form
  code/styles and regenerate the existing pupil/configurator outputs.
- `src/school/teacher-review.js`: explicitly disable Form in the unchanged adult
  Theme02 testing context. Shared runtime bytes do not mean it is enabled there.
- Existing school/navigation/package/teacher-kit tests and configured fixtures:
  preserve their assertions while accounting for the explicit new schema.

No audio engine, external assets, package allowlist, sandbox/CSP, deployment
configuration or evidence adapter changes are needed. Existing publication and
release decisions remain mandatory. A private-prototype export is not pupil-ready.

## Schema contract on this branch

School **schema3** adds `formEnabled:boolean` and `levels.form` (nonempty subset
of1–4). New defaults enable the implemented prototype. A strict schema1 input is
validated under its old field/registry shape, then migrated with **Form disabled**
and all old settings/restrictions preserved. New defaults do not imply an old
school opted into newly implemented content. Malformed or future inputs reject
atomically. Schema2 is deliberately unsupported: it describes the separate draft
PR15, whose conversation content is not available on this branch.

`formPractice` is a separate optional version1 extension of the existing main pupil
progress key/backup format. It contains selected configuration, bounded puzzle/build
practice counts and up to20 explicit `{level,map,previous}` saves. Maps have2–6
A/Av/B/Bv sections; before-version is null or another supported map. No identity,
timestamp, account, pupil upload or analytics is introduced. An absent older-backup
extension preserves current newer Form work; an explicit valid extension replaces
it after confirmation. Invalid imports reject before any existing data changes.
School-disabled history stays exportable, but reopen handlers and controls reject
unavailable activity/configurations. Language and branding updates do not reset it.

## Required plan if both drafts are later approved

This is **not** authority to merge either PR. Review/merge order must be chosen
explicitly. Shared files will conflict; do not call the drafts automatically
compatible just because IDs differ.

1. Rebase the later draft onto the reviewed merged source, combining optional
   progress fields, validators, import-preservation/reset hooks and navigation
   cases. Keep each module's schema and history independent.
2. Use a reviewed combined **school schema4**, with both conversation and Form.
   Validate each old shape explicitly before normalising:
   - v1: preserve all old restrictions; conversation disabled; Form disabled.
   - PR15 v2: preserve conversation selections/levels; initialise Form disabled.
   - Issue16 v3: preserve Form flag/levels; initialise conversation disabled.
   - v4: strict combined fields/registry validation; unknown content/version fails.
   Do not reinterpret v2 as v3 or inherit new-content consent from old defaults.
3. Combine administrator controls, route guards, template schema markers and
   fixture expectations. Keep the adult teacher kit restricted to Theme02.
4. Regenerate `dist` and `setup` **once from the combined source**; never resolve
   generated-file conflicts by choosing either branch's old output.
5. Run all independent musical/visual predicates, both modules' persistence and
   older-backup regressions, school migrations, opaque preview/extracted ZIP,
   teacher-kit isolation and the full required quality gate on the exact new head.
6. Obtain the still-pending human educational/access/device/adoption evidence.
   Neither technical integration nor passing CI clears pupil release BLOCKED.

This plan is a known future integration obligation, not a current implementation
blocker: the contained Form slice works from main without PR15 dependencies.
