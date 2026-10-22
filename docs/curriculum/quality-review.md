# Reusable musical quality criteria and review protocol

**Proposed process; no existing release gate is replaced.** Design readiness, teacher-adoption/design fit, implementation readiness and pupil-release readiness are separate decisions. Use [the design template](activity-template.md), [worked Theme 03](theme03-adjudication.md) and [the current disagreement log](specialist-critiques.md).

## Musical criteria: specific pass conditions

| ID | Criterion and inspection | Failure / hold example | Appropriate evidence |
| --- | --- | --- | --- |
| M1 | Pitches, octave convention, durations, rests, metre, tempo unit and voice/onset offsets are explicit and agree in prose, notation/data and audio. Sum durations with pickup/overlap accounted for. | Example 7 says only E–D–C while the response contains a G pickup; a four-beat bar totals 4.5 without explanation. | Independent event arithmetic and final-document parsing; actual rendered/decode checks; human listening for audibility. |
| M2 | Assessment rule is taught before answering and names exactly what stays/changes. Separate task material from count-in, context, gap and pulse scaffold. | “Which reply is best?” has one scored answer; unassessed gap counted as a wrong rest. | Instruction/event audit and pupil restatement of the rule. |
| M3 | Accepted set is complete under the declared rule. Independently evaluate each offered answer; enumerate fragment permutations where feasible. | A rhythm-only prompt rejects a different-pitch reply with identical rhythm; several endings satisfy a supposedly unique rule. | Independent musical predicates/exhaustive cases, plus teacher interpretation review. |
| M4 | Distractors differ in actually heard target content, violate the intended rule, and test a plausible misconception. No accidental duplicates or alternate valid constructions. | Only labels differ; density prompt accidentally uses the same attack count; a transposed same-contour reply is used as an allegedly wrong distractor under a contour-only brief. | Event comparison, rendered distinction and listener review. A changed integer alone does not prove audible discrimination. |
| M5 | Musical context supports the claim. Establish a tonal reference for named function; specify metre/pulse for timing; identify culturally bounded interpretations. | Last C marked universally “more finished”; anticipation judged without a stable barline. | Contextual musical review and actual stimuli; avoid converting taste into a predicate. |
| M6 | The operation matches the outcome. Listening, reconstruction and creation contribute distinguishable cognitive actions. | Three interfaces all assess exact target identity but are presented as broad musical conversation. | Task analysis, pupil explanation and away-from-screen demonstration. |
| M7 | Four configurations differ in meaningful musical relations/agency with controlled incidental demand. | Add pitch vocabulary, rhythmic subdivision, length and interface controls in one jump. | Exact level matrix and observed usability. No level number establishes age suitability. |
| M8 | Creation has multiple possible outcomes; structural/schema bounds are separate from aesthetics and intention. | A silent/out-of-brief draft called bad music; “creativity” inferred from edit count. | Multiple worked possibilities, neutral feedback, human discussion and pupil revision. |
| M9 | Musical material transfers credibly beyond the screen with instrument-specific limits. | Clapping a rhythm treated as proof of melody/harmony; transposition breaks the named reference. | Teacher-approved voice/instrument adaptation and observed attempt, with comfortable register. |
| M10 | Language/access/scaffolds preserve the same musical task and do not leak the solution. | Pickup means different onsets across locales; drag-only construction; a correct answer encoded in colour or labels. | Three-language semantic review, keyboard/touch/screen-reader and pupil tests on actual artifacts. |
| M11 | Feedback directs a useful next musical action and supports retry/revision. | “Wrong” with no audible feature to compare; reward for speed instead of listening. | Concrete feedback examples and observed pupil recovery. |
| M12 | Claims and evidence are honest, version-bound and separate from practice counts. Saved work survives supported updates/restrictions. | Old prototype PASS copied to a new school ZIP; model review labelled teacher approval; hidden content erases valid saved work. | Candidate identity, evidence provenance, migration/backups and release-gate regression checks. |

A general rubric cannot approve an unspecified question bank. For every example, record criterion result **met / revise / pending / not applicable with reason** and the exact evidence. Do not turn pending into met or average a critical failure away. Record every generator family/configuration/localisation covered; seeded high-volume tests are useful but cannot eliminate an ambiguous musical premise.

## Evidence layers and permitted claims

| Layer | Can establish | Cannot establish |
| --- | --- | --- |
| Written design + independent event checks | Explicit pitches, duration totals, accepted constraints and internal consistency. | Audible distinction, age suitability or learning. |
| Browser/native decode/scheduling | Actual loading, signal samples, selected pitches/onsets, controls/cancellation on a recorded browser version. | Speaker output, all expressive qualities or physical-device accessibility. |
| Perceptual/rendered listening review | Whether the supplied material conveys the advertised contrast for that listener/context. | Universal perception or educational effectiveness. |
| Human music-teacher review | Musical validity, useful feedback, playable transfer and plausible differentiation within stated expertise. | Whole-population effectiveness or browser security. |
| Teacher-adoption/design-fit feedback | Actual teachers’ understanding, teaching value, recommendation friction, trust and voluntary recommendation intent within the reviewed scope. | Musical correctness, actual pupil benefit, device suitability or release approval. |
| Facilitated learner/access/device observation | Whether sampled pupils understand/use the actual artifact, recover and transfer; defects on tested devices. | General efficacy from a small formative sample. |
| Exact-candidate release evidence | Which approved content, transformations and artifact/device versions have required evidence. | Approval of changed content, a different school package or missing evidence. |

A hash proves identity, not quality. Any new school branding/settings output must retain exact-candidate evidence requirements. Current pupilRelease remains BLOCKED when development checks pass; failed checks remain FAIL. Private-prototype export must not be relabelled pupil-ready. No rubric score overrides those decisions.

## Four independent review lenses before synthesis

Each reviewer first receives the same frozen design/examples, source register, actual candidate reference and concrete questions. They do not see the other critiques until their first report is complete. Distinct agents/lenses can expose different errors but share model limitations and are **not independent human experts**. Do not invent specialist credentials or an external endorsement.

| Role | Questions | Required output |
| --- | --- | --- |
| Curriculum planner | Does each relationship recur with deeper agency/context? Are eight strands and transfer represented? Is the plan feasible and non-linear? | Coverage gaps, competing sequencing choices and age/experience assumptions. |
| Theory/composition checker | Do every pitch, rest, duration, onset and accepted alternative agree? Is context sufficient? Which interpretations remain musical? | Per-example validity/counterexamples, ambiguity and perceptual-review questions. |
| Game/inclusive-interaction reviewer | Is making music the useful play loop? Are controls, help and level choice usable without speed pressure or answer leakage? | Likely pupil misconceptions, access barriers and observable pilot checks. |
| QA/evidence reviewer | Do checks exercise actual artifacts and failure cases? What is unverified? Are versioning, backups and gates preserved? | Reproduction/evidence limits, critical blockers and traceable acceptance checks. |

The synthesising author records all substantive disagreements, chooses a reasoned recommendation and keeps unresolved findings visible. A fifth “consensus” paragraph cannot substitute for the independent reports. Human musical review and actual pupil/device evidence remain separate later steps, not a fifth model persona.

## Decisions and stop rules

| Decision | Minimum condition | No-go / hold |
| --- | --- | --- |
| Ready for owner design review | Complete sources/access record, four levels, 8–12 actual examples, independent critiques and disagreement log. Pending human evidence labelled. | Missing event/audio details, unexamined alternatives, fabricated access or claims. |
| Teacher-adoption/design fit | Actual instrumental/ensemble teacher feedback meets TA1–TA5 for the specified short exercise and context, with objections resolved or scope explicitly restricted. | PENDING without real feedback; model review, musical correctness and hypothetical endorsement cannot supply adoption-PASS. |
| Eligible to author a small implementation task | Owner approves scope; human musical review resolves scoring/instruction/difficulty questions for that slice; meaningful checks and migrations specified. | Unresolved correctness/ambiguity, multiple unnoticed valid answers, inaccessible core task, or no actual implementation authorisation. |
| Development check success | Required build/regressions and real-browser checks pass on the actual candidate. | A genuine failure or unavailable check remains failure/missing evidence. Do not skip, mock or bypass security restrictions. |
| Pupil release | Existing required adapters/evidence bind to exact candidate, including human musical review, rendered/speaker/device/accessibility evidence as required. | BLOCKED/FAIL, missing devices or inherited evidence for other bytes. No owner “override” is added here. |

**Critical:** M1–M5 validity/context contradictions, inaccessible required interaction, data loss, or dishonest evidence block the affected slice; “good engagement” cannot compensate. Other refinements may be deferred only with an explicit scope boundary that prevents an unreviewed claim/content from being published as complete. Two repair/review iterations maximum per batch; unresolved findings are held, not silently accepted. Different evidence types are not interchangeable.

## Teacher-adoption/design-fit gate (not performed)

Review materials: [Nynorsk teacher handout](teacher-review-pack.md) and [blank facilitator/feedback/change record](teacher-review-record.md). They are not completed evidence or invitations sent to teachers.

**Current status: PENDING. No actual teacher feedback or positive endorsement has been obtained.** This is a separately named human adoption/design-fit gate, not a software release adapter or a replacement for musical-validity review, owner educational approval, pupil/device validation, implementation authorisation or pupil-release evidence. The same teacher may contribute to different reviews, but their findings must be recorded separately; one sign-off cannot silently clear the others.

Use a low-friction formative review with a small deliberately varied range of teachers, illustratively **3–5 instrumental/ensemble teachers** covering individual and ensemble teaching, pitched and rhythm-led instruments, and differing pupil experience/technical confidence. Seek a sceptical as well as an enthusiastic view. This is a problem-finding proposal, not a representative survey or a validated numerical threshold. Participation/review must not require a teacher account, new school configuration, assignment workflow or pupil-data collection.

Offer a brief individual walkthrough, illustratively 10–15 minutes: show the purpose and an actual available prototype exercise privately (or labelled design materials where implementation is absent); let the teacher find and try it without coaching; ask them to formulate one 3–5-minute recommendation in their usual lesson language. Explain prototype restrictions and do not ask them to send pupils to unreleased material. A design-material review can establish only provisional design fit; recommendation ease for a finished artifact must be rechecked on that artifact before a scoped adoption-PASS. Record what was actually shown and what remained hypothetical.

| Criterion | Ask / observe | Evidence required for a scoped adoption-PASS |
| --- | --- | --- |
| TA1: understood musical purpose | “What would this help your pupil hear or do? What does it not assess?” | Teachers explain the intended musical purpose accurately in their own words, without the facilitator supplying the answer. |
| TA2: value relative to teaching | “When would this add value compared with your existing between-lesson practice, and when would you use something else?” | Concrete teaching use and limitations, not generic praise or a presumed replacement for current practice. |
| TA3: easy recommendation | “Show how you would recommend exactly one exercise to a pupil.” | They independently locate/name the exercise and suggested configuration, outcome and stop point, with no account, assignment administration or extra setup. Capture navigation/wording/time burden rather than hiding facilitator help. |
| TA4: trust and professional role | “Does this supplement your expertise? What claims or feedback would undermine your trust?” | Teachers understand and accept the bounded supplementary role; unresolved misleading assessment or replacement claims block fit. |
| TA5: voluntary recommendation intent | “Once required approvals are met, would you voluntarily recommend this to one of your real pupils? For what need, or why not?” | Actual teacher answers tied to an anonymised teaching situation, including hesitation, refusal and conditions. Do not invent a pupil, require an actual assignment or treat polite interest as a recommendation. |

Record per teacher: broad teaching context (no pupil identity), artifact/design revision and demonstrated route, TA1–TA5 observations/answers, objections in their own terms, proposed changes, conditions/refusals, facilitator prompts, proposed scope and follow-up. Keep notes outside the pupil application under agreed school review arrangements; no analytics, database or public testimonial is required.

**Decision rule:** without actual feedback, remain **PENDING**, never adoption-PASS. After feedback, use **REVISE/HOLD** for unclear purpose, no perceived teaching value, recommendation friction, trust objections or only conditional intent awaiting repairs. Adoption-PASS is permitted only for the explicitly reviewed exercise/context when TA1–TA5 have supporting actual evidence and no unresolved material objection remains in that scope. Do not average a serious objection away or infer acceptance for all instruments/schools from a small group. Where fit differs, document the reasons, restrict the claim and leave other contexts pending; do not pressure a teacher to endorse. Recheck changes in a bounded second pass and hold unresolved issues after two passes. A scoped adoption-PASS is neither an efficacy finding nor authority to implement, assign unreleased content or publish to pupils.

## Human formative review plan (not performed)

Start with one reviewed slice and a deliberately varied small group, illustratively 6–8 pupils across ages 11–13, instruments and experience. Include relevant access needs and actual keyboard/touch devices. This is a problem-finding sample, not a statistically validated minimum or efficacy trial. A teacher/facilitator handles school arrangements/consent and respectful observation outside the application; collect no pupil account or telemetry.

Ask each pupil to restate the rule; predict or sing/tap before choosing; identify what they compared; use replay/stop and change level; enter creation directly; make one chosen revision; and try one relation away from the screen. Ask what remained difficult, not only whether it was enjoyable. Observe required adult prompts, label-only strategies, misunderstanding of “wrong” and recovery after feedback.

Hold if pupils repeatedly misunderstand the declared rule, cannot hear the target contrast, cannot operate a required control, interpret a valid creative alternative as bad music, or lose saved work. Do not average a serious barrier into a passing satisfaction score. Revise and recheck affected tasks within the two-pass bound. Stop/switch approach for hearing discomfort, fatigue or distress. Keep anonymous facilitator observations with purpose-limited retention under school procedures; no recording/upload is required by the app. An unresolved access need requires an actual accessible musical alternative, not merely a disclaimer.

## Review record to reuse

Record the teacher-adoption/design-fit decision separately from musical, pupil/device, owner, coding and release decisions. Record: artifact/design revision; date; reviewer type and limits; criterion/example/configuration/locale; finding; severity; evidence; proposed resolution; who decides; repair pass 1/2; recheck result; remaining scope boundary. Human names/credentials and device/listening facts are filled only when actually obtained. The owner receives the educational decision and recommended next task, not a pile of MIDI or CI questions to adjudicate alone.
