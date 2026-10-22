# Worked Theme 03 adjudication and the place of Echo

**Documentation-only recommendation, 22 October 2026.** Frozen reference: [corrected PR #9 design](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/CONTENT_DESIGN_THEME03.md), [canonical MIDI/duration data](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/examples.json), [Echo source](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/src/conversation.js). This branch starts from main and does not import that PR's application, tests or audio assets. External audio links intentionally pin the reviewed revision rather than a moving branch. PR #9 remains draft.

## A fair comparison

| Dimension | A: implemented Echo core in PR #9 | B: broader proposed musical conversation |
| --- | --- | --- |
| Listening | Choose the reply that exactly repeats the call's final motif, including pitches, rests and durations. A narrow, objectively testable relation. | Hear/predict a taught relation: imitation, retained rhythm, varied ending, specified contrast or timed entry. Distinct rules require distinct demonstrations. |
| Construction | Order unique fragments into that same exact target; useful retention/reproduction, with one accepted ordering. | Construct a new response satisfying a declared brief, allowing all valid outcomes. Must not merely repackage the listening answer. |
| Creation | Truly ungraded pitch/rest invention and revision within a fixed level rhythm, with explicit saving. Not literally another exact-copy test. | Optional pupil intentions, multiple rhythmic/phrase possibilities, repeated listening/revision and transfer. No automatic aesthetic or intention score. |
| Learning value | Builds precise comparison and short pattern vocabulary; musical agency and context are limited. | Makes relationships between musical turns central, without claiming every relation is suitable for all pupils. |
| Cognitive demand | Stable identity rule supports independence; elimination and visible hints can substitute for the intended hearing. | Richer relations increase language/assessment ambiguity; introduce one relation at a time with replay and demonstrations. |
| Differentiation / age | Four configurations differ in length, rhythm/rests and fragments; these do not establish age suitability or equal steps. | Hold incidental load stable while changing the musical decision; teacher/pupil review needed for actual level boundaries. |
| Validity | Exact equality is reliable but cannot establish audiation, transfer, conversation or creativity. | Check specified constraints only; use human observation for intention, effect and musical judgement. |
| Delivery risk | Existing engine/persistence/tests provide a technical foundation; no missing educational evidence is supplied by CI. | More answer sets, timing scaffolds, editing and migrations increase risk. Start with curated, reviewed one-bar examples. |

## Keep, change, defer — proposed disposition

**Keep provisionally:** exact-motif comparison, sounded fragments/reconstruction, native sampled piano and stop/navigation cancellation, replay/hints, free school-enabled level choice, explicitly saved call/response pairs and local privacy. The current creation mode is a useful bounded exploration resource. These strengths are source-verified at the pinned revision, not a human perceptual endorsement.

**Change in a later authorised increment:** describe the component as **Echo / exact-motif practice**, define what its counts mean, and position it inside the motif/listening family rather than claiming it completes Theme 03. Retain its narrow rule and honest acknowledgement that other replies can be musical. Do not automatically rename or repurpose stable IDs or stored work. A label/navigation/schema change needs a compatibility plan and tests, not a silent replacement.

Revisit differentiation: levels 1–2 generated objectives use C4/D4/E4, then levels 3–4 add G4/A4. Creation selectors allow all five pitches at every level. Motif counts are 2/4/4/6; duration arrays are quarters, quarters, 0.5/0.5/1/2, then 0.5/0.5/1/0.5/0.5/1 with a rest in event 4. Fragment counts are 2/2/2/3. The 2→3 step changes pitch vocabulary and rhythm together; the 3→4 step changes length, rest placement and reconstruction demand. These are configurations, not a clean measured learning ladder. Keep current functionality while a reviewed alternative matrix is developed; no level edit occurs here.

**Defer:** rhythm-capable saved response formats, two-role/generative expansion, anticipation as a core requirement and full-year rollout. Do not merge PR #9 simply to preserve useful code, and do not discard it merely because its scope is narrower. Recommended eventual route is a deliberately re-scoped Echo PR after owner/human review, with broader conversation implemented separately. The owner may instead choose to revise PR #9 substantially, but that is a new scope decision, not approval implied by this memo.

## Proposed four configurations for the worked design

These are B's draft configurations, not A's current implementation. Creation remains available in every enabled configuration; examples labelled level 4 are demonstrations, not a creation unlock.

| Level | Concrete material and musical aim | Demand held stable / support | Worked examples |
| --- | --- | --- | --- |
| 1 | One 4-beat bar, four quarter notes, C4/D4/E4/G4. Exact echo and rhythm-only comparison; demonstrate the longer held distractor separately. | Replay/sounded options, optional symbols; no notation prerequisite. | 1–2 |
| 2 | Same length/pulse, quarter notes; add A4 only where needed. Keep an opening, change an ending or choose two-note units. | Stable interface/memory while adding one relation; non-drag construction. | 3–4 |
| 3 | Same bar and pitch pool; half-note production, contour/density contrast or a named tonal ending. | One criterion per round; demonstrate sustain/reference context. | 5–6, 8 |
| 4 | A familiar short call with subdivision, OR a two-bar quarter-note phrase; small chosen creation/revision. | Count-in/pulse for pickup; bar replay for longer memory. Do not combine both demands initially. | 7, 9–10 |

## Ten fully worked original examples

Copied musical events and accepted sets below are from the corrected pinned design; this is an adjudicated review view, not new implemented content. Minor explanatory wording here clarifies review concerns without editing PR #9. Convention: MIDI 60=C4, durations are quarter-note beats, R is rest, 4/4 at 90 quarter-note beats/minute. Ordinary calls/replies are four beats; example 9 is eight. Example 7's response is a half-beat pickup plus four beats, with explicit entry offsets.

Each linked MP3 contains Call, A, B, C separated by one second. Example 7's alternatives each contain four count-in beats, a complete call and a timed reply with low-C3 pulse markers. Example 8 adds a two-beat C3/E3/G3 reference chord and one beat of space before each segment. Context/count-in markers are unassessed. These are offline review renders, not browser/speaker evidence. Audio credit: Salamander Grand Piano by Alexander Holm, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), from [Tone.js](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/src/sounds/ATTRIBUTION.txt); renders alter pitch, gain, envelope and sequencing.

### 01. Echo the whole phrase — configuration 1

**Brief taught before answering:** Copy every pitch and duration in the four-beat call.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/01.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Meets this brief |
| B | `C4(60):1 D4(62):1 E4(64):1 E4(64):1` | Does not meet this brief |
| C | `C4(60):1 E4(64):1 D4(62):1 G4(67):1` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** B changes the last pitch; C exchanges the middle pitches. Replay the differing notes, then sing before choosing.

**Instrument transfer:** Sing, then play on four labelled keys; a percussion pupil can echo rhythm only, which is a different objective.

**Adjudication / human review question:** Exact identity is the only correct answer here. Do not generalise it to all call-and-response. Check that pupils hear the changed middle/ending rather than read the labels. **Human musical/age-suitability review pending.**

### 02. Hear rhythm independently of pitch — configuration 1

**Brief taught before answering:** Select ALL replies with four quarter-note attacks, regardless of pitch.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/02.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Meets this brief |
| B | `G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Meets this brief |
| C | `C4(60):2 E4(64):1 G4(67):1` | Does not meet this brief |

**Accepted set / status:** A, B.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** A and B keep the rhythm. C begins with a half note. Different notes can preserve the same rhythm.

**Instrument transfer:** Clap each reply, then play any comfortable pitches.

**Adjudication / human review question:** A and B are both valid; a single-answer control would be invalid. Demonstrate a held note before using C as a distractor. **Human musical/age-suitability review pending.**

### 03. Change just the ending — configuration 2

**Brief taught before answering:** Keep the first three notes and all durations; change only the final pitch.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/03.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Does not meet this brief |
| B | `C4(60):1 D4(62):1 E4(64):1 A4(69):1` | Meets this brief |
| C | `C4(60):1 E4(64):1 G4(67):1 A4(69):1` | Does not meet this brief |

**Accepted set / status:** B.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** A is a valid echo, but this brief asks for a change. C changes more than the ending. Compare the first three notes.

**Instrument transfer:** Partners trade the same opening and invent different last notes.

**Adjudication / human review question:** A is an echo and C is a broader variation; neither is bad music. Only B changes exactly the named final pitch. **Human musical/age-suitability review pending.**

### 04. Build a new ending — configuration 2

**Brief taught before answering:** Choose two of these three two-note pieces: P=C4(60):1 D4(62):1, Q=E4(64):1 C4(60):1, S=G4(67):1 A4(69):1. Keep P first and finish on C4. Do not reuse a piece.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/04.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 C4(60):1` | Meets this brief |
| B | `C4(60):1 D4(62):1 G4(67):1 A4(69):1` | Does not meet this brief |
| C | `E4(64):1 C4(60):1 C4(60):1 D4(62):1` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** P+Q meets both conditions. P+S keeps the opening but ends on A; Q+P moves the opening. Other endings can still be musical.

**Instrument transfer:** Play P; a partner answers with two notes ending on C.

**Adjudication / human review question:** Clarify the future instruction to “Choose two of these three pieces” (P,Q,S); the existing phrasing could suggest only two pieces exist. P+Q is unique under the two explicit constraints. **Human musical/age-suitability review pending.**

### 05. Contrast the direction — configuration 3

**Brief taught before answering:** Keep four quarter notes; make every successive pitch lower than the previous one.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/05.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Meets this brief |
| B | `G4(67):1 A4(69):1 E4(64):1 C4(60):1` | Does not meet this brief |
| C | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** A descends throughout. B first rises; C rises throughout. Contrast can take other forms, but this round asks for downward motion.

**Instrument transfer:** Trace the contour with a hand, sing it, then play it in a comfortable register.

**Adjudication / human review question:** Strict descent is one deliberately specified contrast, not the definition of musical contrast. No judgement of which contour is better. **Human musical/age-suitability review pending.**

### 06. Contrast rhythmic density — configuration 3

**Brief taught before answering:** Answer four quarter notes with exactly two half notes and no rests, in four beats.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/06.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `G4(67):2 C4(60):2` | Meets this brief |
| B | `G4(67):1 E4(64):1 C4(60):2` | Does not meet this brief |
| C | `G4(67):1 C4(60):1 R:2` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** A has two sustained notes. B has three attacks. C has two attacks but short notes and a rest. Count and sustain before choosing.

**Instrument transfer:** Play or sing two long notes while a partner taps four beats; on drums use sustained rolls or describe note length separately.

**Adjudication / human review question:** Count and duration are separate: C also has two attacks but fails the two-half-notes/no-rests rule. A density-only prompt would need a different accepted set. **Human musical/age-suitability review pending.**

### 07. Anticipate the next bar — configuration 4

**Brief taught before answering:** Count 1 & 2 & 3 & 4 &. Play G4(67) as a half-beat pickup on the & of beat 4, then E4(64) for one beat, D4(62) for one beat and C4(60) for two beats across the next bar.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/07.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 R:1` | Stimulus |
| A | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Does not meet this brief; start offset 3 beats from call onset |
| B | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Meets this brief; start offset 3.5 beats from call onset |
| C | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Does not meet this brief; start offset 4 beats from call onset |

**Accepted set / status:** B.

**Listening cues:** Call 0.00–2.92s; A 3.92–12.50s; B 13.50–22.08s; C 23.08–31.67s.

**Misconception and feedback:** All replies use the same G4–E4–D4–C4 notes and durations. In B, G4 is the half-beat pickup on &4; E4 lands on the next bar’s beat 1, D4 on beat 2, and C4 lasts through beats 3–4. A starts half a beat early; C starts half a beat late. Tap the pulse and say the subdivision first.

**Instrument transfer:** Teacher and pupil alternate a three-beat call and a pickup answer; begin by clapping before using pitches.

**Adjudication / human review question:** Corrected: G is part of the response and is the half-beat pickup, not a new call note. B places E at the barline. This is an optional advanced listening relation, not a pupil tap-latency test. **Human musical/age-suitability review pending.**

### 08. Choose a specified tonal ending — configuration 3

**Brief taught before answering:** In this C-major example, C is our named home note. Choose the reply whose last sounding note is C4.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/08.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `E4(64):1 D4(62):1 G4(67):1 C4(60):1` | Meets this brief |
| B | `E4(64):1 D4(62):1 C4(60):1 G4(67):1` | Does not meet this brief |
| C | `E4(64):1 D4(62):1 G4(67):1 A4(69):1` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–4.92s; A 5.92–10.83s; B 11.83–16.75s; C 17.75–22.67s.

**Misconception and feedback:** A ends on C. B and C end elsewhere; they are possible replies too. Hum the reference C, then compare the final notes.

**Instrument transfer:** Sustain or hum C while a partner tries each ending, then discuss what each suggests.

**Adjudication / human review question:** Named final C is checkable; universal “finishedness” is not. The preceding C-major reference is a scaffold, not evidence that everyone must prefer this ending. **Human musical/age-suitability review pending.**

### 09. Retain a phrase and leave breathing space — configuration 4

**Brief taught before answering:** Keep the entire first bar, change the second bar, and leave its fourth beat silent. Each reply lasts eight beats.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/09.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):1 R:1` | Meets this brief |
| B | `C4(60):1 E4(64):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):1 R:1` | Does not meet this brief |
| C | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):2` | Does not meet this brief |

**Accepted set / status:** A.

**Listening cues:** Call 0.00–5.58s; A 6.58–12.17s; B 13.17–18.75s; C 19.75–25.33s.

**Misconception and feedback:** A keeps the opening and leaves space. B changes the opening; C sustains through the final beat. Sing the first bar, then isolate the second.

**Instrument transfer:** Two pupils share the bars; swap roles and experiment with the final breath.

**Adjudication / human review question:** First-bar retention and last-beat silence are objective. Replay bars separately; hold this example if two-bar memory prevents independent musical comparison. **Human musical/age-suitability review pending.**

### 10. Invent, listen and revise — configuration 4

**Brief taught before answering:** Open creation: make a four-beat reply. Choose an intention: recognise the opening, change the rhythm, or leave space. These are three possible examples, not answers to rank.

[Listen: stimulus and alternatives](https://github.com/Garethspk/musikkverkstad/blob/9b04c200917c40bedb976a726884ca6ce479fe26/docs/theme03-design/10.mp3).

| Segment | Exact notes and durations | Rule result |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):0.5 D4(62):0.5 E4(64):1 G4(67):1 C4(60):1` | Open musical possibility; ungraded |
| B | `G4(67):2 E4(64):0.5 D4(62):0.5 C4(60):1` | Open musical possibility; ungraded |
| C | `R:1 A4(69):0.5 G4(67):0.5 E4(64):1 C4(60):1` | Open musical possibility; ungraded |

**Accepted set / status:** A, B, C are ungraded examples, not automatic correct answers.

**Listening cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and feedback:** A recalls the opening; B stretches then moves; C waits before answering. Listen to your own version, change one thing, and explain what you hear. No aesthetic score.

**Instrument transfer:** Improvise by voice or instrument; a partner describes what they heard before you explain your intention.

**Adjudication / human review question:** All three are possible four-beat replies, not a ranked answer set. Outside the brief, a longer/silent idea may still be meaningful music; explain the bounds without an aesthetic failure score. **Human musical/age-suitability review pending.**

## Example 7: complete timing adjudication

Call: C4@0–1, D4@1–2, E4@2–3, rest@3–4, measured in quarter-note beats from call onset. All responses: G4(67):0.5, E4(64):1, D4(62):1, C4(60):2.

| Alternative | G pickup | E | D | C | Consequence |
| --- | --- | --- | --- | --- | --- |
| A | 3–3.5 | 3.5–4.5 | 4.5–5.5 | 5.5–7.5 | Half a beat early under the declared rule. |
| B | 3.5–4 | 4–5 | 5–6 | 6–8 | G is on &4; E/D/C occupy next-bar beats 1, 2, 3–4. |
| C | 4–4.5 | 4.5–5.5 | 5.5–6.5 | 6.5–8.5 | Half a beat late; no anticipatory entry under this brief. |

One quarter beat at 90 BPM is two-thirds of a second; the start separation is one-third second. No playback gap is inserted between call and pickup. The pickup overlaps only the call's rest, not a sounding call note. This objective criterion identifies B; it does not pronounce the other phrase timings aesthetically inferior.

At the pinned PR #9 revision, `tests/theme03-design.cjs` compares final written tables, MIDI names/numbers/durations, rules, answers, cues and offsets; `tests/browser/design-audio.spec.cjs` samples actual decoded MP3 pitches and locates the G attack within 75 ms. These are useful separate representations, but the signal check does **not** independently measure every note gate or final C sustain, and neither is a human listening test. They are not imported into this documentation-only branch. Future claims of complete audio-duration verification need added evidence, not a relabelled PASS.

## Reusable lessons and next bounded task

The original missing G in the wording is a cross-representation defect: correct data and a decodable recording did not ensure a complete instruction. A source-only validator can approve its own incomplete description. Use M1–M5 in [the quality rubric](quality-review.md) to audit final instructions, event timeline, actual recordings and accepted set separately. Keep pickup ownership, count-in and metrical reference explicit across all languages.

Recommended **future** small slice after owner and human musical review: example 3 listening, example 4 purposeful construction (including the clarified piece-choice wording), and a simple ungraded one-bar reply/revision inspired by 10, available at every enabled level. Do not add anticipation, two-bar memory, rhythm-editor migration or a new generator family in that first slice.

Acceptance for a later authorised implementation: all constrained alternatives follow the declared brief; any additional valid construction is accepted; listening/construction/creation have distinct cognitive actions; three-language instructions preserve the same rule; creation is ungraded and immediately accessible; keyboard/touch/stop/navigation/storage failures are covered; old progress, school restrictions and saved work survive; actual audio/browser and independent musical evidence bind to the candidate. A reviewed design does not replace those tests or approve pupil release.
