# Reusable activity design record

**Template for future authoring; it does not implement an activity.** Complete this record before coding a new musical question, scoring rule, difficulty configuration or pupil instruction. Use [the Theme 03 adjudication](theme03-adjudication.md) as the populated case, and [quality/review](quality-review.md) for decisions. “Pending” is a useful result; a blank evidence field is not approval.

## 1. Identity, purpose and state

Record stable activity/theme ID, design revision/date, author, candidate/source reference, audience and instrumental assumptions. State separately: proposed / designed / implemented / development-tested / human-reviewed / pupil-release-eligible. Include existing work being reused and explicit exclusions. No planned family becomes registry content because its design is written.

Write one precise outcome in the form **“The pupil will hear/play/make [musical relation] in [context] and demonstrate it by [action].”** Identify the larger musical experience it serves. Describe what success cannot establish. Example: retaining an opening while changing an ending is a constrained variation; it does not certify creativity or inner hearing.

## 2. Experience and cognitive action

| Entrance | Musical action | Author must supply | Avoid |
| --- | --- | --- | --- |
| Listening | Discover, predict, compare, imitate by voice/tap/play. | Sounded demonstration on a separate example; task’s audible target; replay/stop; optional prediction before options. | A symbol-only matching puzzle represented as aural understanding. |
| Reconstruction/problem solving | Reproduce, retain/change, select or combine under an explicit musical brief. | Exact piece/event rules and all accepted constructions; non-drag controls; undo/retry and sounded pieces. | Relabelling the identical listening choice without a new cognitive operation. |
| Creation | Explore, improvise/compose, listen, revise or retain a version. | Playable bounds, optional intentions, multiple models and stopping point; no aesthetic score. | A hidden “correct” composition, compulsory verbal explanation or creation locked behind drills. |

Describe how discovery, imitation, manipulation and invention connect without requiring this order. Specify a short route and a longer route. Define what the pupil can do alone and where optional teacher/partner support adds something the app cannot provide.

## 3. Four differentiated configurations

For each of the four activity-specific levels, fill every column. Do not simply add notes and speed.

| Level | Musical relation/agency | Length, pitch/rhythm vocabulary, tempo/metre | Retained/varied features and ending | Memory/UI demand held constant | Access scaffolds and exact acceptance | Transfer/observation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Small supported relation | Exact values required | Specify | Specify | Specify | Specify |
| 2 | Retain/change one feature | Exact values required | Specify | Specify | Specify | Specify |
| 3 | Contrast/context or coordination | Exact values required | Specify | Specify | Specify | Specify |
| 4 | Select/revise/phrase agency | Exact values required | Specify | Specify | Specify | Specify |

If increasing memory, keep controls and vocabulary stable. If introducing subdivision, use a familiar short call and pulse aid; do not add two-bar memory simultaneously. List how a pupil can return to a scaffold or choose a different level while retaining a draft. Explain why the specific configurations are appropriate to the objective; global level numbers are not attainment equivalences.

## 4. Eight to twelve fully worked examples

Include a representative mix across all four configurations and all three entrances, including a basic example, each newly introduced relation, ambiguity/counterexample cases and at least two open musical possibilities. A bank containing only examples of one rule is insufficient. Each example must include:

1. **Context and instruction:** exact wording, tonal/metre context where needed, tempo and pulse unit, range, count-in/reference/gap and whether each is assessed. State rule before marking. Clarify pickup ownership and timeline.
2. **Events:** pitch names with octave plus MIDI numbers, durations in an explicit beat unit, rests, entry offsets and total phrase length; for layers, voice IDs, simultaneous onsets and reference alignment. MIDI 60=C4 convention must be explicit. “C1” must not mean both a low C and C lasting one beat.
3. **Actual listening artifact:** stimulus and every answer/counterexample, file/version/hash reference, reproducible event-to-render mapping, cue timestamps and rendering method. A planned audio link is not a rendered example. Do not copy or regenerate third-party repertoire without permission.
4. **Accepted set:** all valid alternatives and the reason each meets the brief. For a unique target, enumerate/check alternatives or all fragment permutations. For a relational rule, explicitly accept every valid member of the offered set. For creation, mark “ungraded”; separate playable/schema constraints from musical quality.
5. **Counterexamples:** why each fails the narrow rule, what changes in the heard material, and whether it remains a plausible musical reply. Reject inaudible, duplicate, accidentally valid or label-only distractors. Include an example exposing a likely misconception.
6. **Feedback/hints:** locate the audible difference, invite a concrete comparison/action and permit retry. Offer a sounded hint before presenting a full event solution. Do not say “bad music”, “not creative” or imply that tonal preference is universal.
7. **Transfer and critique:** playable voice/instrument/tapping adaptation with limitations; reviewer’s question about musical validity, cognitive load and independent use. Note how this differs from merely clicking the answer.

Freeze worked examples before implementing generators. Future generators must derive their accepted sets from the reviewed musical rule; independently verify that rule rather than only comparing generator output with itself. Add cross-representation regression checks where appropriate: prose/table ↔ canonical events ↔ renderer/recording ↔ accepted set. A copied hash alone proves file identity, not that the sound is musically correct.

## 5. Language and feedback record

NN/NB/EN must teach the same relation and timing. The following is a **draft authoring glossary**, not approved production translation. A language-aware music teacher must review the full instructions in context; term matching alone cannot approve a translation.

| Nynorsk | Bokmål | English | Intended meaning / ambiguity to avoid |
| --- | --- | --- | --- |
| rop og svar | rop og svar | call and response | Related musical turns; not necessarily an exact echo. |
| gjenta heilt likt | gjenta helt likt | repeat exactly | Which pitches, rests, durations and part of the call must match? |
| hald på starten, endre slutten | behold starten, endre slutten | keep the opening, change the ending | Define the boundary and what stays fixed. |
| slag / puls | slag / puls | beat / pulse | Distinguish the counting unit from note attacks. |
| pause | pause | rest | Part of the assessed phrase, unlike an unassessed playback gap. |
| opptakt | opptakt | pickup | Name its pitches, duration, ownership and position relative to the barline. |
| tettare / færre anslag | tettere / færre anslag | denser / fewer attacks | Density is not volume, tempo or note duration. |
| melodiretning | melodiretning | melodic contour | Define any strict rising/falling rule separately from expressive shape. |
| prøv ein annan variant | prøv en annen variant | try another version | Invitation; not an aesthetic failure. |
| lagre / lagra arbeid | lagre / lagret arbeid | save / saved work | Distinguish explicit saved creation from practice counts and temporary rounds. |

Example structural feedback pattern: “The opening stayed the same. The final note changed. Listen to both endings; would you keep this version or try another?” Translate the full causal meaning, not just the nouns. Check decimal fractions, note names, pickup counting and accessible labels in every locale.

## 6. Inclusive play and game design

Keep the current visual design and the three visible entrances. Specify native keyboard/touch activation, descriptive accessible names, focus order, visible selected state and announcements; no drag-only construction or colour-only pitch information. Provide labels without answer leakage and optional notation without making reading the task. Repeated listening must have no score penalty. Do not grade motor latency as rhythm unless a separate validated performance design justifies it.

Give a useful stopping point (“keep this version”, “try one change”), recoverable error feedback, undo and a route back to the call. Do not use leaderboards, public scores, streak pressure or completion locks. Explain audio loading/failure and cancellation. Slower playback must retain the specified metrical relation. Sensory fatigue, hearing comfort and access needs require human/real-device checks; an emulated viewport cannot certify them.

## 7. Persistence and school boundaries

List exactly what is saved: completed practice by mode/configuration, explicitly saved musical events and any draft; do not imply unfinished-round recovery if absent. Include schema/version, stable IDs, bounds, local-only storage, backup/import semantics and failure feedback. Preserve language preference and valid progress on branding/settings changes. Disabled content may become unavailable for reopening but its valid history must remain preserved/exportable.

For older backups with a missing optional extension, preserve newer stored work; for an explicit replacement field, define confirmation and atomic validation rather than a silent destructive merge. A new rhythm/phrase format needs a migration design. No accounts, analytics, pupil names, microphone collection, external database or compulsory uploads. No administrator editor enters the pupil package. This is a design requirement, not a new persistence implementation.

## 8. Teacher note and review handoff

Give the teacher: intended relation, prerequisites actually needed, misconception probes, instrument adaptations, what to listen for, alternative interpretations, feedback boundaries and how to leave the task if it does not fit the pupil. Separate “needs teacher discussion” from “usable independently”. Do not market an unresolved teacher-dependent task as a validated solo activity.

Attach the source/access record, event/audio/example inventory, four independent role critiques, disagreement log and proposed disposition. Record named human reviewer/date/limits only after that review actually occurs. Apply [the go/no-go rubric](quality-review.md), with at most two repair/review passes per batch. Owner approval of a design is distinct from implementation authorisation and pupil-release approval.
