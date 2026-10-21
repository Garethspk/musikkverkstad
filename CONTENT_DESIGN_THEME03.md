# Theme 03 curriculum design — owner review required

**Status: proposed design, not approved curriculum. 21 October 2026.** Prepared after the implementation already in PR #9; this is not evidence that the earlier pre-implementation gate was satisfied. No further application implementation is authorised until the owner reviews the design. PR #9 must remain open and unmerged. Pupil release remains **BLOCKED**.

This responds to [the latest PR review](https://github.com/Garethspk/musikkverkstad/pull/9#issuecomment-6324653521) and [the original design gate](https://github.com/Garethspk/musikkverkstad/issues/8#issuecomment-6324348799). Passing technical checks cannot establish musical or pedagogical validity. These original musical examples, audio and proposals are review materials only; they are not registered or offered as implemented curriculum by the application.

## Decision requested

Recommend **B, a broader musical-conversation curriculum**, but retain the current implementation as a narrower **Echo** component for possible reuse after review. Do not merge the existing code under the claim that it completes that broader curriculum. Do not discard technically useful echo work merely because its educational scope is narrower.

The owner should decide whether to re-scope this PR to an explicitly named Echo activity, or separate the existing code from a replacement Theme 03 implementation. Either route needs independent music-teacher review of the actual candidate and the existing release evidence. No rename, re-scope, new marking rule or feature change is implemented by this document. After approval, implement only one reviewed vertical slice, not the entire proposal at once.

## A and B: comparative curriculum design

**A — implemented exact-echo core.** Listening asks for the response that repeats the call's final motif, including pitches, durations and rests. Reconstruction orders fragments of that motif. Creation permits freely chosen pitches/rests within a fixed level rhythm, with explicit saving and no aesthetic score. Thus the existing creation activity does allow invention; it does not explicitly teach relationships between a call and a varied or contrasting reply. The three activities currently share substantial exact-replication demands.

**B — proposed musical conversation.** Separate aural noticing/prediction, purposeful phrase construction, and open playing/listening/revision. Teach imitation, retaining a feature while varying another, specified contrasts, phrase endings and anticipation. Objective prompts specify a narrow audible constraint before answering. Open creation has many possible musical outcomes and no automatic judgement of quality or inferred intention.

| Criterion | A: existing echo core | B: proposed conversation |
| --- | --- | --- |
| Musical value | Useful pattern attention, auditory comparison and reproduction. Limited evidence of responsive phrase-making; exact identity is overrepresented. | Relates memory to choices about identity, change, direction, space and endings. Includes making and revising music, not just recognising a target. |
| Cognitive demand | One stable identity rule helps independence, but reconstruction can duplicate recognition and fragment ordering can reward elimination. Higher levels increase length, rhythm and rests together. | More musical concepts and language; risk of overloaded instructions and ambiguous marking. Keep one new relation per round, retain familiar controls and offer worked listening demonstrations. |
| Ages 11–13 | Short patterns may suit beginners at any age; experienced players may find them trivial. Age alone does not establish a starting level. | Optional entry points and instrument transfer can accommodate wider experience. Suitability, terminology and independent use remain hypotheses for pupil trials. |
| Assessment validity | Event equality can be checked reliably. It measures a constrained echo, not general musical understanding, creativity or conversation. | Check explicitly named event/timing relations only. Multiple valid answers must be accepted. Reflection, intention, expressive effect and musical quality require listening and human discussion, not an automatic score. |
| Implementation and test risk | Existing engine, persistence and seeded generator checks reduce technical uncertainty. Technical determinism does not validate pedagogy. | Higher risk: multiple-answer sets, rhythm editing, phrase timing/count-in, accessible construction and save compatibility. Use curated examples first; extend generators only after an independently reviewed musical specification. |
| Recommendation | Preserve as a possible introductory Echo component; do not treat completion as conversation mastery. | Preferred direction, conditional on design review and a small validated slice. Do not claim the whole model is implemented or research-validated. |

### What exists versus what is proposed

At implementation commit `9c9ad97fd188593287fbdea670a32394655423c7`, A's generated objective motifs use C4/D4/E4 at levels 1–2 and C4/D4/E4/G4/A4 at levels 3–4; creation selectors allow all five pitches at every level, at 108 BPM. Final motifs contain 2, 4, 4 and 6 events respectively. Level 3 durations are 0.5, 0.5, 1, 2 beats; level 4 has 0.5, 0.5, 1, 0.5, 0.5, 1 with a rest at the fourth event. Distractors change one sounding pitch while retaining timing. Reconstruction has one exact ordering. Saved creations use the fixed rhythm, with editable pitches/rests. This is the implementation baseline, not the sequence proposed below.

**None of B's new selection rules, multi-answer prompts, rhythm choices, count-ins, graded phrase constraints or level sequence is implemented by these design artifacts.** The audio below is offline illustration at 90 BPM; it is not a recording of the current application.

## Consulted sources and limits

These are conceptual lenses, not empirical validation of this application's four levels. Original examples, numerical limits and UI proposals below are our design choices. No full-book access or human expert consultation is implied.

| Lens | Material actually consulted | Design implication and boundary |
| --- | --- | --- |
| Keith Swanwick, *Teaching Music Musically* | [Author's 2001 paper: English abstract](https://periodicos.ufmg.br/index.php/permusi/article/view/57685), DOI [10.35699/2317-6377.2001.57685](https://doi.org/10.35699/2317-6377.2001.57685). The requested Routledge book page was access-blocked; the book was not read. The PDF had no extracted text; no claim of full-paper reading. | Treat response as musical discourse with context and multiple interpretations. An exact echo can serve this purpose but cannot represent its full scope. This broad rationale does not prescribe our tasks. |
| Edwin Gordon / Music Learning Theory | GIML's [skill learning sequence](https://giml.org/mlt/skilllearningsequence/) and [methodology](https://giml.org/mlt/methodology/). These explanatory pages, not Gordon's complete books, were read. | Establish tonal/metre context and familiar sound patterns; listen/sing/play before symbolic labels; distinguish discrimination from inference. Our four selectable levels are not Gordon's sequence or an audiation diagnostic. |
| John Paynter, *Sound and Structure* (1992) | [Publisher/bibliographic description on Google Books](https://books.google.com/books/about/Sound_and_Structure.html?id=qLF5swEACAAJ). No full text or project pages were available. | The description positions composing/inventing alongside interpreting and listening. It supports considering creation central, but does not substantiate any specific exercise or progression here. Full-book consultation remains desirable. |
| Lucy Green, *Music, Informal Learning and the School* | The requested publisher page was access-blocked. Consulted Green's own [Open University interview transcript](https://www.open.edu/openlearn/mod/oucontent/view.php?id=47959&section=3.4), particularly her account of learner choice, copying by ear, peer learning and integrated musical activity. | Offer non-linear entry and learner revision. A solo app with supplied miniatures cannot reproduce friendship-group learning, chosen recordings or whole-song practice. Structured constraints and learner autonomy are in tension; keep prompts optional and do not market this as Green's method. |
| Norsk kulturskoleråd | Read relevant music sections of the requested [2016 framework PDF](https://www.kulturskoleradet.no/_extension/media/4731/orig/attachment/2016_Rammeplan_kulturskolen.pdf), especially ear/theory linked to playing and pupils' composition/improvisation; also consulted the [online framework's music section](https://kulturskoleradet.no/rammeplanen), sections 3.3.2–3.3.4. The dated PDF is not presented as the current edition. | Connect listening, playing, reflection and creation, adapting to differing learner experience. Include transfer beyond the screen. Framework alignment is an educational rationale, not evidence of usability, mastery or compliance certification. |

No source establishes that these ten examples teach effectively, that 90 BPM is optimal, or that C-major pentatonic material represents all pupils' musical cultures. Those are bounded starting assumptions to test. Tonal closure here means a named C reference within these examples, not a universal law of music.

## Intended learning and evidence

| Operation | Pupil action | Evidence we can obtain | What it cannot prove |
| --- | --- | --- | --- |
| Hear | Notice a retained rhythm, changed pitch, contour or rest. | Choice plus replay and optional explanation. | A correct click alone does not show the strategy used. |
| Predict | Hum, tap or imagine a specified reply before auditioning it. | Optional self-report or teacher observation; no microphone required. | The app cannot inspect inner hearing. |
| Reproduce | Sing/play a short motif, then assemble it. | Event arrangement matches a stated pattern. | On-screen ordering is not proof of instrumental or vocal accuracy. |
| Vary | Retain an anchor and alter a named feature. | Explicit constrained relation, including all valid alternatives. | It is not an aesthetic judgement or general creativity score. |
| Invent | Make several replies and revise one after hearing it. | Saved versions and pupil-described intention, locally only. | Event data cannot establish originality, expression or intention. |
| Explain | Describe what stayed, changed or felt different. | Optional private reflection or teacher dialogue. | No automated scoring of language, taste or musical worth. |

Aural noticing begins with sound and a plain-language instruction. Reconstruction/phrase building requires producing a relationship rather than repeating the same multiple-choice judgement. Creation starts with a playable instrument and repeated listening; it is available at every enabled level, with no compulsory objective-task completion. Never require a correct answer to unlock musical exploration.

## Proposed four selectable levels

These are activity entry points, not age bands or a linear prerequisite ladder. Pupils retain freedom among school-enabled levels. At all levels: replay without penalty, separate call/reply audition, a stop control, familiar keyboard/touch controls, optional slower tempo, and an explicit preview of the rule. Do not simultaneously raise memory length, symbolic vocabulary and interaction complexity.

| Level | Pattern, rhythm and pitch | Retention/variation and phrase aim | Assessment and scaffolding | Example links |
| --- | --- | --- | --- | --- |
| 1: Notice and echo | One 4-beat bar, four quarter notes, C4/D4/E4/G4. Example 2 additionally demonstrates a longer held sound as a recognition contrast, not a production requirement. | Hear exact imitation; separate rhythm from pitch. Predict by humming. | Teach equality and rhythm-only criteria separately. Call always replayable; choices never require notation reading. | 1–2 |
| 2: Keep and change | Same one-bar length, pulse and controls; add A4 only if needed. Still quarter notes. | Retain an opening; vary an ending, or build a reply from two-note units. | Keep length/memory constant while introducing one relation. Offer labelled or sounded pieces with non-drag alternatives. | 3–4 |
| 3: Contrast and ending | Same one-bar length and pitch pool; half-note production introduced against familiar quarters. | Contrast contour or density, then compare a named tonal ending. One criterion per round. | Demonstrate long versus short sounds and the C reference. A musical alternative failing a brief is not called bad music. | 5–6, 8 |
| 4: Phrase and anticipation | Introduce subdivisions in a familiar one-bar call, OR two-bar quarter-note phrases; do not combine both advances initially. Same pitch pool. | Anticipate a barline; retain a first bar and revise a second; leave a breath. | Count-in/pulse required for anticipation; bar-by-bar replay for length. Open creation can vary rhythm, but constrained timing and longer memory are practised separately. | 7, 9–10 |

The L1 pool and four-beat opening deliberately differ from A's existing two-note lowest level. Whether a shorter two-note introduction is preferable is a review question, not an implemented change. Level 4 does not mean that all pupils must master anticipation. A pupil may explore creation at level 1 or revisit echo at any level.

## Worked original musical examples

Notation: `C4(60):1` means MIDI 60 for one quarter-note beat; `R:1` is a one-beat rest. All are 4/4 at 90 quarter notes per minute, within C-major pentatonic, with equal nominal velocity. Each ordinary call and reply is four beats; example 9 is eight beats. Durations specify note gates, not expressive performance prescriptions. No notation reading is required in the proposed pupil task.

The [canonical event and cue data](docs/theme03-design/examples.json) gives every MIDI pitch, duration, answer set, audio segment offset and special entry time. Each linked MP3 contains **Call, A, B, C**, with one second of silence between segments. These are original review-only offline renders of the repository's C4 piano sample using pitch resampling, with short attack/release ramps. They are not application-engine, browser, real-device, speaker or independent listening evidence. MP3 timestamps are approximate because of encoder padding. No claim is made that an automated file check establishes audible discriminability.

Audio sample credit: Salamander Grand Piano by Alexander Holm, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), from the [Tone.js Salamander sample collection](https://github.com/Tonejs/audio/blob/master/salamander/README). These review renders change pitch, gain, envelopes and sequencing and encode the result as MP3. Original sample attribution remains in [src/sounds/ATTRIBUTION.txt](src/sounds/ATTRIBUTION.txt).

For example 7 each alternative track segment includes its own four-beat pulse count-in, complete call and timed response. Low C3 pulse markers continue on integer beats; the answer starts inside the final call rest. For example 8 each segment begins with a two-beat C3/E3/G3 reference chord followed by a beat of silence. These scaffolds are outside the assessed notes.

### 01. Echo the whole phrase — level 1

[Listen to call and all alternatives](docs/theme03-design/01.mp3). **Rule taught first:** Copy every pitch and duration in the four-beat call.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Meets the stated brief |
| B | `C4(60):1 D4(62):1 E4(64):1 E4(64):1` | Does not meet this brief; not an aesthetic judgement |
| C | `C4(60):1 E4(64):1 D4(62):1 G4(67):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** B changes the last pitch; C exchanges the middle pitches. Replay the differing notes, then sing before choosing.

**Instrument transfer:** Sing, then play on four labelled keys; a percussion pupil can echo rhythm only, which is a different objective.

**Design self-critique / teacher question (not a teacher endorsement):** An exact-match task measures discrimination, not expressive response-making. Are the changed ending and exchanged middle notes perceptible?

### 02. Hear rhythm independently of pitch — level 1

[Listen to call and all alternatives](docs/theme03-design/02.mp3). **Rule taught first:** Select ALL replies with four quarter-note attacks, regardless of pitch.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Meets the stated brief |
| B | `G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Meets the stated brief |
| C | `C4(60):2 E4(64):1 G4(67):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A, B. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** A and B keep the rhythm. C begins with a half note. Different notes can preserve the same rhythm.

**Instrument transfer:** Clap each reply, then play any comfortable pitches.

**Design self-critique / teacher question (not a teacher endorsement):** Multiple correct answers are intentional. Can the pupil distinguish the rhythm criterion from whole-phrase identity?

### 03. Change just the ending — level 2

[Listen to call and all alternatives](docs/theme03-design/03.mp3). **Rule taught first:** Keep the first three notes and all durations; change only the final pitch.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Does not meet this brief; not an aesthetic judgement |
| B | `C4(60):1 D4(62):1 E4(64):1 A4(69):1` | Meets the stated brief |
| C | `C4(60):1 E4(64):1 G4(67):1 A4(69):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** B. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** A is a valid echo, but this brief asks for a change. C changes more than the ending. Compare the first three notes.

**Instrument transfer:** Partners trade the same opening and invent different last notes.

**Design self-critique / teacher question (not a teacher endorsement):** Do not suggest B is inherently better music. Is the distinction between an echo and a one-note variation clear?

### 04. Build a new ending — level 2

[Listen to call and all alternatives](docs/theme03-design/04.mp3). **Rule taught first:** Use two two-note pieces: P=C4(60):1 D4(62):1, Q=E4(64):1 C4(60):1, S=G4(67):1 A4(69):1. Keep P first and finish on C4. Do not reuse a piece.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 C4(60):1` | Meets the stated brief |
| B | `C4(60):1 D4(62):1 G4(67):1 A4(69):1` | Does not meet this brief; not an aesthetic judgement |
| C | `E4(64):1 C4(60):1 C4(60):1 D4(62):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** P+Q meets both conditions. P+S keeps the opening but ends on A; Q+P moves the opening. Other endings can still be musical.

**Instrument transfer:** Play P; a partner answers with two notes ending on C.

**Design self-critique / teacher question (not a teacher endorsement):** This constrains a new phrase rather than reconstructing a hidden echo. Can pupils hear the pieces without relying on their labels?

### 05. Contrast the direction — level 3

[Listen to call and all alternatives](docs/theme03-design/05.mp3). **Rule taught first:** Keep four quarter notes; make every successive pitch lower than the previous one.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Meets the stated brief |
| B | `G4(67):1 A4(69):1 E4(64):1 C4(60):1` | Does not meet this brief; not an aesthetic judgement |
| C | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** A descends throughout. B first rises; C rises throughout. Contrast can take other forms, but this round asks for downward motion.

**Instrument transfer:** Trace the contour with a hand, sing it, then play it in a comfortable register.

**Design self-critique / teacher question (not a teacher endorsement):** Strict descent is a deliberately narrow rule, not a definition of all musical contrast. Can pupils predict the downward answer before hearing it?

### 06. Contrast rhythmic density — level 3

[Listen to call and all alternatives](docs/theme03-design/06.mp3). **Rule taught first:** Answer four quarter notes with exactly two half notes and no rests, in four beats.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `G4(67):2 C4(60):2` | Meets the stated brief |
| B | `G4(67):1 E4(64):1 C4(60):2` | Does not meet this brief; not an aesthetic judgement |
| C | `G4(67):1 C4(60):1 R:2` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** A has two sustained notes. B has three attacks. C has two attacks but short notes and a rest. Count and sustain before choosing.

**Instrument transfer:** Play or sing two long notes while a partner taps four beats; on drums use sustained rolls or describe note length separately.

**Design self-critique / teacher question (not a teacher endorsement):** Attack count alone cannot distinguish A and C. Does the pupil hear duration as well as density? Avoid implying sparse music is less energetic.

### 07. Anticipate the next bar — level 4

[Listen to call and all alternatives](docs/theme03-design/07.mp3). **Rule taught first:** Count 1 & 2 & 3 & 4 &. Play G4(67) as a half-beat pickup on the & of beat 4, then E4(64) for one beat, D4(62) for one beat and C4(60) for two beats across the next bar.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 R:1` | Stimulus |
| A | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Does not meet this brief; not an aesthetic judgement; starts 3 beats after call onset |
| B | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Meets the stated brief; starts 3.5 beats after call onset |
| C | `G4(67):0.5 E4(64):1 D4(62):1 C4(60):2` | Does not meet this brief; not an aesthetic judgement; starts 4 beats after call onset |

**Accepted set:** B. **Audio cues:** Call 0.00–2.92s; A 3.92–12.50s; B 13.50–22.08s; C 23.08–31.67s.

**Misconception and proposed feedback:** All replies use the same G4–E4–D4–C4 notes and durations. In B, G4 is the half-beat pickup on &4; E4 lands on the next bar’s beat 1, D4 on beat 2, and C4 lasts through beats 3–4. A starts half a beat early; C starts half a beat late. Tap the pulse and say the subdivision first.

**Instrument transfer:** Teacher and pupil alternate a three-beat call and a pickup answer; begin by clapping before using pitches.

**Design self-critique / teacher question (not a teacher endorsement):** Timing is the sole assessed dimension. This is advanced and needs an audible count-in and pulse; is the subdivision usable without a teacher?

The initial G4 is part of the response, not part of the call or a separate count-in. The response totals 4.5 beats: a half-beat pickup plus a four-beat bar. Only B places E4 at the next barline (call-relative beat offset 4); A places it at 3.5 and C at 4.5. All three keep the same note sequence, so their entry timing is the assessed difference. The existing recording already contains these notes and offsets and is unchanged. Automated document/event checks and decoded-audio checks are development evidence only; independent listening and educational approval remain pending. Subsequent curriculum architecture/adjudication belongs to [Issue #10](https://github.com/Garethspk/musikkverkstad/issues/10), before broader Theme 03 implementation.

### 08. Choose a specified tonal ending — level 3

[Listen to call and all alternatives](docs/theme03-design/08.mp3). **Rule taught first:** In this C-major example, C is our named home note. Choose the reply whose last sounding note is C4.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `E4(64):1 D4(62):1 G4(67):1 C4(60):1` | Meets the stated brief |
| B | `E4(64):1 D4(62):1 C4(60):1 G4(67):1` | Does not meet this brief; not an aesthetic judgement |
| C | `E4(64):1 D4(62):1 G4(67):1 A4(69):1` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–4.92s; A 5.92–10.83s; B 11.83–16.75s; C 17.75–22.67s.

**Misconception and proposed feedback:** A ends on C. B and C end elsewhere; they are possible replies too. Hum the reference C, then compare the final notes.

**Instrument transfer:** Sustain or hum C while a partner tries each ending, then discuss what each suggests.

**Design self-critique / teacher question (not a teacher endorsement):** Ending on C is objectively testable; feeling finished is culturally and contextually dependent. The tonic drone/chord is a scaffold, not proof of universal closure.

### 09. Retain a phrase and leave breathing space — level 4

[Listen to call and all alternatives](docs/theme03-design/09.mp3). **Rule taught first:** Keep the entire first bar, change the second bar, and leave its fourth beat silent. Each reply lasts eight beats.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 G4(67):1 E4(64):1 D4(62):1 C4(60):1` | Stimulus |
| A | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):1 R:1` | Meets the stated brief |
| B | `C4(60):1 E4(64):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):1 R:1` | Does not meet this brief; not an aesthetic judgement |
| C | `C4(60):1 D4(62):1 E4(64):1 G4(67):1 E4(64):1 G4(67):1 C4(60):2` | Does not meet this brief; not an aesthetic judgement |

**Accepted set:** A. **Audio cues:** Call 0.00–5.58s; A 6.58–12.17s; B 13.17–18.75s; C 19.75–25.33s.

**Misconception and proposed feedback:** A keeps the opening and leaves space. B changes the opening; C sustains through the final beat. Sing the first bar, then isolate the second.

**Instrument transfer:** Two pupils share the bars; swap roles and experiment with the final breath.

**Design self-critique / teacher question (not a teacher endorsement):** More memory is introduced here only after short patterns. Can replay and separate bar audition prevent this becoming a memory test?

### 10. Invent, listen and revise — level 4

[Listen to call and all alternatives](docs/theme03-design/10.mp3). **Rule taught first:** Open creation: make a four-beat reply. Choose an intention: recognise the opening, change the rhythm, or leave space. These are three possible examples, not answers to rank.

| Segment | Exact pitches and durations | Decision |
| --- | --- | --- |
| Call | `C4(60):1 D4(62):1 E4(64):1 G4(67):1` | Stimulus |
| A | `C4(60):0.5 D4(62):0.5 E4(64):1 G4(67):1 C4(60):1` | Meets the stated brief |
| B | `G4(67):2 E4(64):0.5 D4(62):0.5 C4(60):1` | Meets the stated brief |
| C | `R:1 A4(69):0.5 G4(67):0.5 E4(64):1 C4(60):1` | Meets the stated brief |

**Accepted set:** A, B, C. **Audio cues:** Call 0.00–2.92s; A 3.92–6.83s; B 7.83–10.75s; C 11.75–14.67s.

**Misconception and proposed feedback:** A recalls the opening; B stretches then moves; C waits before answering. Listen to your own version, change one thing, and explain what you hear. No aesthetic score.

**Instrument transfer:** Improvise by voice or instrument; a partner describes what they heard before you explain your intention.

**Design self-critique / teacher question (not a teacher endorsement):** All three are admissible; intention cannot be inferred reliably from event equality. A silent or longer draft is not bad music: explain the four-beat brief and allow revision.

## Cross-cutting teacher and pupil review

**Independent human music-teacher critique is pending for every example 01–10.** The per-example critiques above are design self-critique, not a fabricated independent review. The owner should ask a teacher to listen to all tracks and inspect every accepted and rejected alternative before approving implementation. An automated event check cannot satisfy this gate.

For each example, ask the teacher to record: is the stated rule musically meaningful and understandable; are all accepted responses valid and all distractors invalid under that rule; are alternative interpretations possible; is the audible distinction clear; does the feedback help the pupil hear it; and does the transfer exercise suit the instrument? A disagreement about ambiguity blocks that example until revised and re-reviewed. Cap a batch at two repair/review rounds, then hold unresolved items.

Ask pupils aged 11–13 with different experience to explain the task in their own words before answering; show which part they compared; demonstrate replay/stop and an alternative level; play or tap one reply away from the screen; describe one chosen revision; and say whether the feedback made them want to try again. Observe rather than collect pupil accounts or recordings. No test participation, feedback or analytics is uploaded by the application. Adult-facilitated pilot arrangements and any consent are separate from the application.

Specific unresolved questions: Can a beginner distinguish the long-note alternatives in 6? Does the reference in 8 establish C sufficiently? Can 7 be used independently with the proposed pulse aid? Is the two-bar load in 9 reasonable with separate bar replay? Does the multiple-answer wording in 2 lead to selection errors? Do experienced pupils find the fixed sound world limiting? No positive answer is assumed.

## Interaction and instrument adaptations proposed

Keep the current pupil visual design. Use existing focus styles and native controls. Touch targets must be comfortably selectable without dragging; phrase building needs select-piece/choose-slot controls, keyboard activation and a reversible undo. Provide descriptive accessible names without leaking the answer; never encode pitch solely through colour. Retain sound audition alongside optional note names, clear focus, Escape/Stop cancellation and no autoplay. Do not create speed-based grades. Screen-reader usability and touch ergonomics require real-device review, beyond DOM checks.

For voice, choose a comfortable register, allow humming and transpose as a whole; singing accuracy is never graded by the app. For keyboard, use a small labelled range. For wind/string pupils, a teacher can choose a playable key/register and separate breath or bow constraints from the musical relation. For percussion, practise rhythm, timing, density and silence; a rhythm-only adaptation cannot assess melodic contour or tonal ending. Pair work can exchange calls and replies and discuss differing intentions. Solo use should invite this transfer without implying a computer replaces a musical partner.

Optional note names are a bridge to instruments, not the primary puzzle. Start with heard demonstration and prediction, then reveal event structure if wanted. Preserve enabled-level choice and a route to free creation without completing a sequence. No pupil progress or existing saved work should be reset by a future curriculum or school-settings update; availability changes must not silently delete data. Future rhythm-capable saves need a separately reviewed migration plan.

## Approval and subsequent implementation plan — not authorisation to code

1. Owner reviews comparison and recommended re-scope, all ten examples and the clearly limited sources. Obtain an independent human music-teacher critique, recording disagreements and outstanding source access. Decide Echo versus broader Theme 03 scope explicitly.
2. After approval only, implement a small level-2 vertical slice: hear a retained opening/change of ending (example 3), construct a constrained new ending (4), and an ungraded reply with listen/revise. Include a worked audible rule demonstration. Avoid anticipation, new generator families and rhythm editing in this slice.
3. Acceptance for that slice: constrained answers demonstrably follow the declared rule; multiple musical possibilities are not marked aesthetically wrong; construction differs cognitively from recognition; creation is not graded; keyboard/touch/stop/navigation work; all languages receive reviewed instructions; school availability, saved work and backup compatibility remain intact. Run all existing regression and real-browser checks and obtain candidate-bound independent musical and rendered-audio evidence.
4. Only after reviewing the slice, add density, contour and endings in separate batches; consider anticipation and longer phrases last. A maintained curriculum specification must drive generators and their exhaustive/seeded invariant tests. Test-event equality must not be reported as proof of musical effect.

No new content may become school-selectable or release-complete merely because this document or its MP3s exists. Preserve security isolation, prototype restrictions, content-hash-bound evidence and all required release checks. Human teacher review, actual audible output, supported devices and other missing evidence remain distinct gates. This design work does not repair or waive any unrelated application issue.

## Verification record

This design batch adds only this document and review audio/data. Application source, translations, generated pupil package, tests, workflows, settings schema and release decisions are unchanged. Arithmetic validation checked ten calls and thirty alternatives, their intended bar lengths and the explicit anticipation start offsets. Audio files were generated from the canonical event data; metadata/decodability can be checked automatically. These checks do not establish listening quality, pedagogical suitability or speaker output. A separate model reviewer checked all ten accepted sets and durations, including the pickup timing. One repair pass clarified example 4 notation, removed answer-label disclosure from example 7's proposed pupil prompt, kept example 1 distractors inside the level-1 pitch vocabulary, and corrected the description of current creation pitch choices. The reviewer did not listen to the tracks or independently retrieve sources. This non-human review is not independent music-teacher evidence. No human teacher/pupil approval is recorded; design review remains pending.

### Example 7 consistency correction

The omitted G4 pickup has now been named explicitly in the rule and feedback. The canonical MIDI events, correct answer B and MP3 were already consistent and remain musically unchanged. `node tests/theme03-design.cjs` parses the final written tables for all ten examples, including note-name/MIDI agreement, rules, feedback, accepted sets and audio cue offsets; it independently fixes Example 7’s G–E–D–C durations and A/B/C entry offsets. `tests/browser/design-audio.spec.cjs` decodes the committed MP3 in real Chromium, measures the call/reply pitches and pickup attack times against independently specified expectations, in desktop and mobile viewports. Both are automatically discovered by the existing quality workflow. Signal analysis does not establish speaker output, human perception or educational validity. PR remains draft; Issue #10 holds the next curriculum architecture/adjudication step.
