# Curriculum decision memo — Issue #10

**22 October 2026 · proposal for school leadership review · documentation only**

Recommend a year framework that revisits **four musical families**, with pupils free to enter at any school-enabled level. Keep the existing Echo work as an optional, narrowly described practice component. It should not define or certify the broader skill of musical conversation. Do not expand or merge PR #9 on the strength of technical test results alone.

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

1. **Time and setting:** approve optional enrichment as the default, using a suggested 15–20-minute encounter and a shorter exit route. Decide whether occasional adult/partner support is available. These durations are pilot assumptions, not a proven dosage.
2. **Local musical relevance:** identify representative instruments and musical practices with a teacher, including local and pupil-chosen music. Do not require leadership to select MIDI pitches or adjudicate technical tests. Rights, cultural context and playable adaptations remain the team's responsibility.
3. **Human review capacity:** appoint a music-teacher reviewer with relevant instrumental/aural experience and arrange a small facilitated pupil/accessibility pilot. If that capacity is unavailable, keep the proposal and prototype in review status rather than substituting model approval.

There is no school decision needed about note offsets, browser security, data migrations or how many tests make a release pass. The development/review team owns those checks and brings any unresolved educational disagreement back with a recommendation.

## Evidence and remaining limits

Research consulted official framework guidance, GIML explanations, author texts/interviews, publisher material and a small ear-playing study. [The evidence brief](docs/curriculum/evidence-brief.md) separates source claims, empirical evidence, interpretation and access limits. No inaccessible book is claimed as fully read. No source validates this application's year sequence, level boundaries or educational effectiveness.

Four model reviewers independently produced specialist-style critiques **before synthesis**: curriculum planning, theory/composition, game/inclusive interaction and QA. Their objections and the resulting decisions are recorded in [the critique and disagreement log](docs/curriculum/specialist-critiques.md). They did not act as human teachers, hear pupils, certify devices or establish perceptual clarity. Agreement between models is not four independent empirical studies.

The corrected Theme 03 Example 7 explicitly uses a G4 half-beat pickup on &4, followed by E4–D4–C4 in the next bar. Its written events, timing and marking rule agree; its existing decoded-audio checks cover selected pitches and the pickup attack, not every gate duration or human perception. Full examples and the implementation critique are in [the worked adjudication](docs/curriculum/theme03-adjudication.md).

## Next step after review

Approve or revise the framework and the proposed Echo re-scope. Then obtain human review of a **small level-2 retain/change slice**, including its instructions, alternatives and instrument transfer. Only a subsequent explicit implementation task should add it. Acceptance criteria and review stop rules are in [quality and review](docs/curriculum/quality-review.md). Do not implement the whole year at once.

Reading route: [year and differentiation](docs/curriculum/year-framework.md) → [sources](docs/curriculum/evidence-brief.md) → [reusable authoring template](docs/curriculum/activity-template.md) → [musical quality/review gates](docs/curriculum/quality-review.md) → [worked Theme 03 / Echo decision](docs/curriculum/theme03-adjudication.md) → [independent critiques and synthesis](docs/curriculum/specialist-critiques.md).
