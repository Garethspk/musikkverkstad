# Issue18 — combined Conversation and Form integration

**Development integration; draft review.** Main `8af7a24` includes Formverkstad from
PR17. This branch adds the bounded Theme03 implementation from PR15 head
`9d66655ecae22c46c843cffe5a19fb7d5bf78e7c`, preserving both activity modules.
No GitHub PR is merged by this work. PR9 stays unchanged. Human teacher/adoption,
pupil, real assistive-technology and physical-device validation remain **PENDING**;
pupil release remains **BLOCKED** when code checks pass; genuine failures stay FAIL.

## Review boundary and source reconciliation

The existing draft PR15 is reused, as Issue18 prefers. A reviewed integration
snapshot is based on merged main, then recorded as the resolved tree of a feature-
branch merge with PR15's original head and main as parents. This preserves all
reviewed commits and permits a normal fast-forward push to the PR15 branch, without
force-pushing or merging a GitHub PR. The resulting tree must exactly equal the
manually reconciled snapshot; generated files come only from the unified build.
PR15 remains draft and unmerged. No competing integration PR supersedes it.

`src/conversation.js` and its independent Node music suite are copied unchanged
from PR15. `src/form.js`, `src/form.css` and its Node visual/music suite remain
unchanged from main. No new questions, material, levels or curriculum predicates
are authored. Shared app/navigation/settings/build hooks are reconciled explicitly;
no branch's generated files are selected as a conflict resolution. `dist` and
`setup` are regenerated from the unified source only.

Three numbered themes retain previous/next/Start/Continue behaviour. Form remains
an **auxiliary visual activity**, with its own home entrance and remembered mode/
level, not Theme04 or a visual-only weekly theme. Both expose independent entrances
and school-enabled pupil choices. Optional Echo stays narrow whole-call repetition,
separate from retain/change completion; both activities' creation remains ungraded.

## School schema4 migration matrix

Each historical input is validated against its own complete root/registry shape
before normalisation. Common branding/logo/language/age/preset validation still
applies. Migration never mutates the input or guesses consent from old defaults.

| Input | Required old shape | Conversation after migration | Form after migration |
| --- | --- | --- | --- |
| v1 | Old eight level IDs, Theme01/02 only, no Form flag | Disabled; initialise stored level options1–4 | Disabled; initialise options1–4 |
| PR15 v2 | Old eight plus Conversation level ID; Theme01/02/03 subset; no Form flag | Preserve explicit theme inclusion and enabled levels | Disabled; initialise options1–4 |
| Form v3 | Old eight plus Form level ID; Theme01/02 subset; boolean Form flag | Disabled; initialise options1–4 | Preserve flag and enabled levels |
| Combined v4 | All ten registered IDs; three-theme subset and boolean Form flag | Preserve explicit inclusion/levels | Preserve flag/levels |

New v4 defaults contain both implemented prototypes. This does not opt an existing
school into new material or approve pupil release. Old restricted and formerly
unrestricted settings both follow the same migration policy. Unsupported versions,
missing/injected old fields, unavailable themes, invalid levels and unsafe logos
reject atomically. Old logos and valid branding are retained by the shared validator.
School settings remain separate from pupil data. The administrator remains outside
the pupil package; no accounts/backend/analytics or external runtime services exist.

## Independent progress and backups

The main storage key/backup version remains unchanged. Optional extensions retain
their own validators and versions:

- `groovePractice` v1: existing Theme02 practice/rhythms, unchanged.
- `conversationPractice` v2: listening/building/Echo counts and saved call/response
  before/current pairs. Imported PR9 v1 Echo archives remain only in `legacyEcho`,
  never new conversation-completion counts; historical108BPM audition is retained.
- `formPractice` v1: visual puzzle/build counts and saved2–6section maps with an
  optional before-version; not hearing or aesthetic evidence.

Missing older-backup extensions preserve the corresponding newer current module
independently. A present valid extension replaces that part after the existing
confirmation, including an explicitly empty extension. One invalid module rejects
the **entire** import before either module, base data or Theme01 changes. Confirmed
imports reset temporary editors, not unrelated valid saved work. Cancelled imports
change nothing. Raw corrupted storage remains protected until explicit validated
replacement; denied storage retains temporary work for export.

Language changes and school branding/configuration updates preserve explicit saves.
Disabled activities/configurations cannot reopen through controls, handlers,
Continue or direct routing, but valid histories remain visible/exportable. Temporary
session drafts follow the original module contracts; no unfinished-round recovery
or combined mastery tally is introduced.

## Audio, visual access and teacher-kit boundaries

Conversation retains native piano loading, timing, Stop and cancellation. Moving
from playing/loading Conversation through navigation into Form must cancel sources,
timers and late callbacks. Form does not initialize audio or require a listening
answer; an existing AudioContext from an earlier activity is not a new Form request.
The two modules keep their native keyboard/touch controls, labels and focus behaviour.

The private adult entry remains configured with `themes:['groove']` and
`formEnabled:false`. Shared runtime bytes do not enable either new activity.
Native browser regressions attempt direct access/actions for both; school opaque
preview/extracted-ZIP checks exercise the unified settings. Existing sandbox/CSP,
positive allowlist, editor separation and release decisions are unchanged.

## Modalities and later curriculum work

A prospective weekly theme is organised around a **musical relationship**, not a
single sensory modality. It may combine audio, visual/text, construction and
creative exploration, with accessible alternatives and free pupil entry. Form is
a reusable auxiliary visual resource within that direction. This integration adds
no calendar, assignment system, compulsory multimodal tour or weekly-completion
score. A visual result is not evidence of hearing or instrumental transfer.

## Verification and outstanding evidence

The four independent non-human review perspectives and disagreements are recorded
in [reviews](reviews.md). Both original module finite-oracle suites, independent
historical-schema tests and combined-storage/import tests run alongside every
existing regression. Native Chromium integration tests cover shared navigation,
actual audio cancellation, settings versions, simultaneous saves, languages,
restrictions and package isolation. Node simulations are labelled separately.

Exact-head command/CI results belong in the draft PR. Local managed `file://`
refusals remain actual failures; no assertion, test or browser security policy is
waived. Passing technical checks cannot supply teacher adoption, pupil learning,
real screen-reader/physical-device or speaker evidence. No deployment, publication,
teacher contact or pupil release/distribution occurs.
