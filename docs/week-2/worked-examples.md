# Worked musical checks — Week 2

Original short examples; no third-party score/audio or new sound engine. All note
names specify octave. Quarter-note beat units in 4/4. Visual tasks do not claim
hearing, instrument performance or perceptual validation. These are finite authored
models, not a universal theory that every musical phrase must be monotonic.

## Form detective

Existing Form palette: A = C4 D4 E4 G4; A′ = C4 D4 E4 A4;
B = G4 E4 D4 C4; B′ = G4 E4 D4 D4. Every pitch lasts one beat.
Compare the **specified adjacent pair**, not every possible pair in a longer map.

| Case | Brief and selected pair | Musical distinction |
| --- | --- | --- |
| form-1 | Repeat, sections1–2 | AA and BB repeat every note; AB contrasts; A–A′ changes the ending. |
| form-2 | Contrast, sections1–2 | AB/BA are the offered opposing base phrases; A′–A and B–B′ are related changes, outside this narrow contrast brief. |
| form-3 | Repeat, sections2–3 | BAA and ABB repeat at the requested location; AA–A′ repeats elsewhere but not in the requested pair. |
| form-4 | Contrast, sections2–3 | AAB and BBA contain opposing base phrases in the target pair; A–A′–B does not use the two base versions there. |
| form-5 | Repeat, sections1–2 | A′–A′ and B′–B′ are literal repeats too. Same-family A–A′ is not an exact repeat. |
| form-6 | Contrast, sections1–2 | ABA contrasts in the chosen pair; B–B′–B changes a related ending instead. The entire ABA map also returns, but that is not this question. |
| form-7 | Repeat, sections3–4 | B–A′–B′–B′ and A′–B–A′–A′ repeat at the end; other repetitions earlier do not answer the brief. |
| form-8 | Contrast, sections3–4 | A′–A′–B–A and B′–A–A–B contrast in the final pair; a changed final note alone is not the specific AB/BA relation. |

Changing which pair matters is a contextual comparison, not eight renamings of one
AA/AB quiz. Diagrams display actual pitches and the equivalent ordered pitch text.
If the palette ever gains different rhythms, exact repeat must compare durations
as well as pitches; the current fixed four-quarter grammar makes that equality explicit.

## Melody contour

Each case contains several alternatives and can accept more than one. Exact option
IDs/order and independently tested correct sets are in source/tests. All charts use
the same C4–A4 axis; a longer held last note is not another pitch transition.

| Case | Target | Positive example | Counterexample and reason |
| --- | --- | --- | --- |
| contour-1 | Strictly rising | C4 D4 E4 G4 (1+1+1+1 beats) | C4 G4 E4 A4 ends higher but turns down internally. |
| contour-2 | Strictly falling | A4 G4 E4 C4 | A4 E4 G4 C4 ends lower but has an internal rise. |
| contour-3 | Level | E4 E4 E4 E4 | C4 C4 D4 D4 has repeated pitches and a rise; not level or strictly rising. |
| contour-4 | Mixed | C4 E4 A4 E4 | C4 D4 G4 A4 strictly rises; the arch changes direction. |
| contour-5 | Mixed | A4 E4 C4 D4 | A4 G4 E4 C4 strictly falls; the valley turns upward. |
| contour-6 | Mixed | C4 D4 D4 G4 (.5+1.5+1+1 beats) | G4 E4 D4 C4 strictly falls; repeated D4 breaks strict rising even without a reversal. |
| contour-7 | Mixed | C4 G4 E4 C4 | E4 E4 E4 E4 is level; equal first/last pitches alone do not imply a level melody. |
| contour-8 | Strictly rising, larger leaps | C4 G4 A4 (1+1+2 beats) | C4 C4 A4 repeats before leaping; the two-beat ending is a held note, not two attacks. |

## Practice choices

Six situations each provide three defensible, revisable paths. For a stalled transition,
isolating the boundary can reveal the connection but needs reintegration into the phrase;
a slow steady pulse gives time but should be checked across the actual transition;
silent notation inspection can clarify what changes but is preparation rather than proof.
None is universally best. Consequences explain what to notice next.

Other cases investigate rushing at section boundaries, measuring rests, combining
pitch/rhythm, fatigue and taking a break, and expressive alternatives. Taking a break
may be the useful decision; no new repetitions or saves are mandatory. The app neither
listens to private playing/tapping/singing nor awards scenario correctness. A saved
before/current plan records choices only, with a clear one-case stopping point.
