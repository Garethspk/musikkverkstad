# Issue23: Conversations and Week1 integration

**Draft integration from main8af7a24; not a merge or pupil release.** Inputs are
PR15 `e451194dc8abd034245829b853c40681394c9857` and PR22
`e48480d04070d883cd98ac5e0df9a32ab7ce9c31`. The new branch reconciles shared
hooks explicitly. No existing PR is changed, force-pushed, merged or closed.
No deployment, publication, staff contact or pupil distribution is included.
Human musical/educational, TA1–TA5, real AT, speaker/device and pupil validation
remain **PENDING**; pupil release **BLOCKED** on technical success, genuine failures
remain FAIL. Model reviews and viewport tests cannot supply those human approvals.

## Source provenance and unchanged learning contracts

- Conversation musical material, predicates and original musical Node suite match PR15.
  One inherited archive-dispatch defect is repaired: saved/current and legacy Open
  actions run before any access to a question that may not yet exist.
  Four-quarter calls/replies at90BPM, complete retain/change/ending/descent predicates,
  optional narrow whole-call Echo, ungraded response/revision and legacy108BPM Echo
  archive retain their meanings. Legacy Echo is never new conversation completion.
- Programme core/UI/CSS match PR22 exactly: only Week1, three tasks (Pulse trail,
  Symbol mechanic, Rhythm workshop).12pulse/12symbol fixtures, held/rest/attack
  distinctions, all272binary rhythms including silence, saved brief/division and
  before/current semantics stay unchanged. Audio is optional; no mandatory tour.
- Form source/CSS and its finite musical/visual suite match merged main. It is
  auxiliary visual structure, not a numbered weekly theme or hearing evidence.
- Theme01/02, other auxiliaries, piano samples/credits, existing pupil preferences
  and explicit saves remain. Three numbered themes coexist with separate Form
  and Week1 entrances. Pupils freely choose available configurations per module;
  numbers are not a common attainment scale or automatic promotion.

Changes reconcile app/navigation/settings/admin/build/import/fixtures, plus that
bounded archive-dispatch ordering repair. No new
musical question, accepted-answer rule, cultural claim, level, scheduler or activity
is authored. Weeks2–6 and52-week banks remain future work; PR20 is a planning input,
not release-approved content. Each teacher recommendation remains one optional
3–5-minute task, with stopping while uncertain allowed and no account/monitoring.

Generated dist/setup are rebuilt from unified source; neither branch's generated
outputs are selected. Source equality proves provenance, not human validation.
Exact-head Node/browser/CI evidence is recorded in the draft PR and
[review record](reviews.md), never inherited from a source branch.

## School schema6: independent historical readers

Common exact root fields: schemaVersion, schoolName, logo, defaultLanguage,
colourPreset, ageGroups, themes, levels. “Old8” is theme,groove,rhythm,melody,
harmony,puzzle,notation,create. Historical roots, level IDs/allowed values, theme
choices and boolean flags are checked **before** adding any missing content.
All old levels are nonempty subsets1–4 except create=[1]. Unsupported versions,
extra/missing keys, unavailable themes, invalid flags/levels/logos reject atomically;
input objects/arrays are never mutated or retained as output aliases.

| Input | Exact historical levels; additional root flags | Permitted historical themes | Conversation after migration | Form after migration | Week1 after migration |
| --- | --- | --- | --- | --- | --- |
| v1 | Old8; none | Theme01/02 | Off | Off | Off |
| PR15 v2 | Old8+conversation; none | Theme01/02/03 | Preserve explicit theme/levels | Off | Off |
| Form v3 | Old8+form; formEnabled | Theme01/02 | Off | Preserve explicit flag/levels | Off |
| PR15 combined v4 | Old8+conversation+form; formEnabled | Theme01/02/03 | Preserve explicit theme/levels | Preserve explicit flag/levels | Off |
| PR22 v5 | Old8+form+programme; formEnabled,programmeEnabled | Theme01/02 | Off | Preserve explicit flag/levels | Preserve explicit flag/levels |
| Combined v6 | All11; formEnabled,programmeEnabled | Theme01/02/03 | Preserve explicit theme/levels | Preserve explicit flag/levels | Preserve explicit flag/levels |

**v4 and v5 are siblings, not cumulative versions.** A v5 root cannot masquerade as
v4, or a v4 root as v5. Newly initialised level options do not enable absent content.
Branding/logo/language/colour/age and deliberate restrictions remain unchanged.
New v6 prototype defaults include implemented content only; old unrestricted settings
still migrate with historically absent modules off. Current eligibility/revocation
checks apply after migration. No availability flag or document clears release gates.
Settings remain separate from pupil data; administrator code stays out of pupil ZIPs.

## Progress, archives and navigation

The existing progress key/root version remains. `conversationPractice` v2,
`formPractice` v1, `programmePractice` v1 and `groovePractice` v1 keep independent
strict validators and formats. Theme01 storage and legacy Echo archives remain
separate. Do not convert one before/current representation into another.

For every optional extension independently:

- Missing in an older backup: preserve corresponding newer current data.
- Present valid: replace that extension after existing explicit confirmation,
  including an empty extension. Cancel changes nothing.
- Any invalid sibling: abort the entire import before base/other archives/Theme01
  or persistent storage mutate. Raw corrupt bytes stay protected; denied/quota
  storage keeps temporary work exportable.

Confirmed imports reset temporary editor state coherently for each module without
erasing preserved explicit archives. Language/branding/school changes preserve
valid saves and language preference. Disabled module/configuration cannot reopen
through home, Continue, direct route, handlers or archived Open, but valid history
remains readable/exportable. Continue remembers route/mode/configuration, not an
unfinished answer or all temporary brief choices; explicit saved objects restore
actual brief/division and before/current content.

## Audio and package isolation

Shared Stop invokes both Conversation and programme cancellation, alongside old
modules. Moving between modules while playing or loading must stop sources/timers,
suppress late starts and prevent cancelled Conversation auditions earning credit.
Fresh Form/Week1 visual tasks must not create AudioContext/request samples. Optional
native playback remains real piano; silence reports silence honestly. Native signal/
scheduling checks do not verify physical speakers or perceived educational quality.

School opaque preview and extracted ZIP compile the same schema6/route guards and
three Week1 tasks. CSP, allowlist, offline sample transport and editor separation
are unchanged. Adult teacher entry explicitly disables Form/programme and includes
only groove; direct Conversation/Form/Week1 routes/actions cannot change their
archives. Shared bytes do not grant availability.

## Review and remaining decisions

Four independent non-human lenses critique curriculum, music, inclusive/game design
and QA before synthesis, with a bounded final source pass. See [reviews](reviews.md).
New independent fixtures cover every historical shape and mixed archives; retained
module suites and native browser regressions remain enabled. Local file-policy
refusals must remain actual failures; no security bypass or skip is acceptable.
Owner review of this draft is separate from any decision about replacing original
PRs, merging, collecting human evidence or pupil release. No such action occurs here.
