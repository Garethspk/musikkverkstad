# Issue #19 — four critical non-human review lenses

**23 October 2026.** These are separately articulated AI-perspective critiques of the frozen initial taxonomy, 52-week grid and six-week backlog. They are **not independent external agents, credentialed specialists, human teacher interviews or empirical validation**. Source quality is bounded by merged curriculum documentation, existing music examples and the repository. The synthesis below records objections and what remains unresolved, not invented endorsements.

## Curriculum reviewer
**Finding:** The 24 types offer breadth, but a taxonomy is not a learning progression. Weeks 7–52 reuse a rotating matrix of eight triples; mere recurrence does not establish cumulative understanding. Core year vs holiday weeks are an organisational convenience and must not impose 52 obligatory lessons. **Disposition:** leave rows expressly PROPOSED and require a future authored sequence/content review for each cluster; retain four-family spiral as backstage coverage, not weekly discipline segregation. A pupil can enter at any enabled level. **Outstanding:** real teacher suitability and consistent progression are PENDING.

## Music/theory/composition reviewer
**Finding:** First-six examples show some correct structural predicates (A/B repeat/return; C4-D4-E4-G4 changed ending; quarter+half+half overfills 4/4). Risks: beat-rest and pitch-event symbols can be misleading if visual diagrams imply sound; a fixed C-major pitch palette cannot represent wider traditions; staff landmarks require clef, transposing instruments need contextual handling; ensemble assignment and expression have several defensible solutions. **Disposition:** the backlog now explicitly separates objective brief validity from free choices, requires complete clef/octave/event metadata, no aesthetic grade, and human context/instrument review. **Outstanding:** most examples are authored *concepts*, not the 8–12 fully enumerated content cases per new activity; those must be completed before implementation.

## Game design and inclusive-interaction reviewer
**Finding:** Three independently accessible games each week is better than repeated audio quiz screens, but a rigid three-button pattern still risks feeling like a worksheet. Text-only exercises can overtax reading, and applying the same 'select all' interaction 52 weeks creates shallow variety. **Disposition:** maintain different mechanics (map, rearrange, revise, debug, scenario, instrument transfer), low-friction optional 3–5-minute entry, text equivalents for visuals, keyboard/touch, no timers and no compulsory sequence. **Outstanding:** no pupil experience, game enjoyment or accessible screen-reader test is demonstrated. A prototype of several varied tasks should precede scale.

## QA and evidence reviewer
**Finding:** The original 52×3 spreadsheet-like grid is editorial data only, with no full case bank, licensing register, localization or artifact build. Status can be misread as implementation. PR #15 is draft, so its Theme03 examples must not be assumed in main. **Disposition:** status warning and main/draft/proposed labels are prominent; quality criteria separate exact predicate tests, scenario acceptance, translation, offline behavior, school restrictions/backup, and release evidence. No code or CI changed in this PR. **Outstanding:** risk of repeated, superficial candidates cannot be eliminated by proposed numerical quotas; release stays BLOCKED.

## Synthesis, disagreements and decisions

| Concern | Chosen decision | Remaining review gate |
|---|---|---|
| 24 unique activities versus 24 large apps | Reusable engines with typed content banks; stage six weeks before expanding | Engineering benchmark once implemented |
| Is listening privileged? | No. Visual, text, notation and creative work stand alone with their own objectives | Teacher/pupil observation |
| Fixed 52-week cadence | 38 core +14 optional; reordering/revisiting permitted | School/teacher decision |
| Three weekly slots versus burdensome homework | All three independently selectable, recommend just one short exercise | TA1–TA5 adoption |
| Audio and visual module availability | Main includes Form and Theme02; PR15 remains draft | Integration merge decision separately |
| Is the 52-week grid production-ready? | **No**. It is 156 planned slots; only first 18 have worked starting prompts, not final reviewed content packs | Content authoring and M1–M12 review per activity |
| Can we claim four independent human reviews? | **No**. These are four non-human critique lenses | Actual human music/teacher, accessibility, pupil and device reviews PENDING |

**Recommendation:** documentation suitable for planning and prioritising a staged six-week vertical slice, not yet educationally validated or ready for full-year automatic generation. Do not implement or merge existing feature PRs as a side effect. Pupil release **BLOCKED**.
