# Curriculum decision memo — Issue #10

**22 October 2026 · proposal for school leadership review · documentation only**

The default use is **one teacher-recommended 3–5-minute exercise between lessons**, with no teacher account, assignment administration or extra setup per recommendation. A 15–20-minute session is optional extended exploration. Recommend a year framework that revisits **four musical families**, with pupils free to enter at any school-enabled level. Keep the existing Echo work as an optional, narrowly described practice component. It should not define or certify the broader skill of musical conversation. Do not expand or merge PR #9 on the strength of technical test results alone.

This proposal addresses [Issue #10](https://github.com/Garethspk/musikkverkstad/issues/10). It is a design deliverable, not an approved year of application content. Main contains Themes 01–02; the corrected Theme 03 design and Echo implementation remain on [draft PR #9](https://github.com/Garethspk/musikkverkstad/pull/9). No activity, registry, school package, test, workflow or release decision changes in this PR. Pupil release remains **BLOCKED**; an actual failed development gate remains **FAIL**.

## Recommended decisions

| Decision | Recommendation | Reason / boundary |
| --- | --- | --- |
| Year architecture | Four recurring families over four flexible spirals, approximately 38 opportunities including revisits and local choices. | Provides depth across listening, rhythm, melody, harmony, form, expression, creation and playing. It is not 38 new themes or a mandatory timetable. |
| Differentiation | Four selectable configurations per activity; increase musical agency and relationships rather than merely memory or speed. | A pupil can need a short listening example and make adventurous music. Level numbers are not age bands or comparable attainment scores. |
| Experience | Offer discovery, imitation, manipulation and creation within the existing three entrances. | No need for four new interface modes. Creation is available from the start, not a reward for correct answers. |
| Echo in PR #9 | Retain its useful code provisionally as a reusable **Echo** component; revise the educational claim and level rationale in a later authorised increment. | Exact listening and reconstruction are legitimate narrow tasks. Fixed-rhythm creation allows invention, but does not teach all the relationships promised by “conversation”. No rename or code re-scope occurs here. |
| Broader Theme 03 | Prefer explicit imitation, variation, contrast and ungraded revision. Review a small one-bar retain/change slice first. | The ten corrected worked examples make the alternative concrete. Anticipation and longer phrases are optional extensions, not expectations for every pupil. |
| Review and release | Adopt the proposed musical-quality rubric and four-role review process for future work, subject to owner approval. | Model critiques are useful challenges, not independent human expertise. Human musical, pupil, speaker/device and exact-candidate evidence remain outstanding. |

## What leadership needs to decide

1. **Time and setting:** approve one teacher-recommended **3–5-minute between-lesson exercise** as the default; 15–20 minutes is optional extended exploration. Decide whether occasional adult/partner support is available. These durations are pilot assumptions, not a proven dosage.
2. **Local musical relevance:** identify representative instruments and musical practices with a teacher, including local and pupil-chosen music. Do not require leadership to select MIDI pitches or adjudicate technical tests. Rights, cultural context and playable adaptations remain the team's responsibility.
3. **Human review capacity:** arrange the separate teacher-adoption/design-fit review, appoint a music-teacher reviewer with relevant instrumental/aural experience and arrange a small facilitated pupil/accessibility pilot. If that capacity is unavailable, keep the proposal and prototype in review status rather than substituting model approval.

There is no school decision needed about note offsets, browser security, data migrations or how many tests make a release pass. The development/review team owns those checks and brings any unresolved educational disagreement back with a recommendation.

## One exercise a teacher could recommend

**Illustrative recommendation, not an actual teacher endorsement or permission to use the unreleased prototype with pupils:** “Between lessons, spend 3–5 minutes on **Theme 02 → Listen**, with **level 1: one bar, quarter notes** as a suggested starting point. Hear the reference and A/B, choose the matching rhythm and replay once if useful. Tap the pulse and point out one note/rest difference you heard. After that single comparison, stop; bring any uncertainty to our next lesson.” Pupils remain free to choose another school-enabled level. There is no requirement to finish Repair, Creation or a series of rounds.

**Outcome:** a short, heard rhythm comparison connected to keeping pulse, not a mastery certificate. **Stopping point:** one comparison and a brief tap/explanation; stop within the short practice period even if uncertain, rather than grinding for a score. No account, assignment dashboard, teacher monitoring, saved-round requirement or extra configuration is needed. The teacher simply names the existing theme, entrance and suggested configuration verbally or in the pupil's usual lesson notes. This assumes an approved school package has already been provided with that content enabled; initial school distribution is separate from making a recommendation. Current release restrictions are unchanged.

The [teacher-adoption/design-fit gate](docs/curriculum/quality-review.md#teacher-adoptiondesign-fit-gate-not-performed) asks whether real instrumental/ensemble teachers understand this purpose, find it useful alongside their own teaching, can recommend it easily, trust its supplementary role and would voluntarily recommend it to a real pupil once approved. **Current adoption status: PENDING — no actual teacher feedback exists.** Musical correctness, teacher adoption, pupil/device validation, owner approval, implementation authorisation and pupil release are separate decisions.

## Evidence and remaining limits

Research consulted official framework guidance, GIML explanations, author texts/interviews, publisher material and a small ear-playing study. [The evidence brief](docs/curriculum/evidence-brief.md) separates source claims, empirical evidence, interpretation and access limits. No inaccessible book is claimed as fully read. No source validates this application's year sequence, level boundaries or educational effectiveness.

Four model reviewers independently produced specialist-style critiques **before synthesis**: curriculum planning, theory/composition, game/inclusive interaction and QA. Their objections and the resulting decisions are recorded in [the critique and disagreement log](docs/curriculum/specialist-critiques.md). They did not act as human teachers, hear pupils, certify devices or establish perceptual clarity. Agreement between models is not four independent empirical studies.

The corrected Theme 03 Example 7 explicitly uses a G4 half-beat pickup on &4, followed by E4–D4–C4 in the next bar. Its written events, timing and marking rule agree; its existing decoded-audio checks cover selected pitches and the pickup attack, not every gate duration or human perception. Full examples and the implementation critique are in [the worked adjudication](docs/curriculum/theme03-adjudication.md).

## Ready-to-use teacher-review materials

The [Nynorsk teacher handout](docs/curriculum/teacher-review-pack.md) provides one existing five-minute exercise and TA1–TA5 questions. The [blank review/change record](docs/curriculum/teacher-review-record.md) gives a short facilitator procedure and fields for actual answers, objections, revisions and scoped decisions. These are prepared materials only: no teachers have been contacted, no feedback exists and adoption remains PENDING.

## Next step after review

Approve or revise the framework and the proposed Echo re-scope. Then obtain teacher-adoption/design-fit feedback and the separate human musical review of a **small level-2 retain/change slice**, including its instructions, alternatives and instrument transfer. Only a subsequent explicit implementation task should add it. Acceptance criteria and review stop rules are in [quality and review](docs/curriculum/quality-review.md). Do not implement the whole year at once.

Reading route: [year and differentiation](docs/curriculum/year-framework.md) → [sources](docs/curriculum/evidence-brief.md) → [reusable authoring template](docs/curriculum/activity-template.md) → [musical quality/review gates](docs/curriculum/quality-review.md) → [worked Theme 03 / Echo decision](docs/curriculum/theme03-adjudication.md) → [independent critiques and synthesis](docs/curriculum/specialist-critiques.md).
