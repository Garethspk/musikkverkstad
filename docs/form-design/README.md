> The visual/musical activity contract below is unchanged. Issue18 now combines
> this activity with Theme03 under school schema4; the earlier separate-branch
> integration boundary is historical. See [the current contract](../integration-18/README.md).

# Formverkstad — visual musical form, Issue #16

**Pre-code design, revision 2 · 22 October 2026.** The four independent first
reviews and adjudication preceded runtime implementation; see [reviews](reviews.md).
Issue #16 authorises this bounded implementation. It does not supply human
educational approval. Teacher adoption, human educational/access/device evidence
remain **PENDING**; pupil release remains **BLOCKED**.

The pupil will recognise, construct and revise repetition, contrast, return and a
specified variation in a visual map of short musical sections. This practises
representation of musical structure. It does **not** assess hearing, instrumental
performance, aesthetic quality or large-scale form mastery. No audio is included
or required. The existing application's separate audio checks remain intact.

## Musical and visual grammar

Each equal-width card represents a miniature section: **one 4/4 bar, four sounding
quarter notes**, with MIDI 60=C4. This is an exercise convention: actual musical
sections need not be one bar, equal length or in 4/4. No tempo is assessed.

| Card ID / printed label | Exact MIDI pitches | Named pitches, each one quarter note | Relationship |
| --- | --- | --- | --- |
| A | 60,62,64,67 | C4 D4 E4 G4 | Rising base miniature. |
| Av / A′ | 60,62,64,69 | C4 D4 E4 A4 | Same first three pitches/rhythm as A, changed final pitch. |
| B | 67,64,62,60 | G4 E4 D4 C4 | Descending base; every corresponding pitch differs from A. |
| Bv / B′ | 67,64,62,62 | G4 E4 D4 D4 | Same first three pitches/rhythm as B, changed final pitch; final D repeats. |

Dots use **one shared pitch scale**, C4–A4: SVG `y=76−6×(MIDI−60)`; equal beat
positions `x=20+40×index`, index 0–3, in a shared 160×105 viewBox. Never normalise
per card. Lines show separate successive notes, not glissando or loudness. Printed
pitch names, numbered beats and duration text carry the same meaning without SVG.

A-family has a circle/solid frame; B-family a diamond/dashed frame. A prime badge
and “changed final pitch” describe the variant; accessible names say “A variation”
or “B variation”. Base and variation retain the same family marker. Colour is
supplementary. B′ is not strictly descending; do not generalise B's contour to its
whole family. A/B contrast is deliberately defined by this material, not by the
universal claim that different letters, colours or any changed note mean contrast.

## Four freely selected configurations

All material stays visible; longer return maps are not a memory test. The numbers
are configurations, not age bands, measured ability or an automatic progression.

| Configuration | Structural relation / agency | Objective bounds and exact predicate |
| --- | --- | --- |
| 1 | Distinguish repetition and contrast. | Choose repeat or contrast. Two bars; selectable A/B only. Repeat `[X,X]`; contrast `[X,Y]`, where X,Y are distinct A/B. |
| 2 | Coordinate opening, contrasting middle and literal return. | Three bars; A/B only. `[X,Y,X]`, X≠Y. Matching endpoints alone is insufficient. |
| 3 | Recognise a related, directed changed-ending version. | Two bars; A/Av/B/Bv. Only `[A,Av]` and `[B,Bv]`. Base first; named variation second. |
| 4 | Choose the structural intention and revise. | Choose any preceding brief; same predicate and two/three-bar length. Increased agency, not arbitrary speed or vocabulary. |

Creation is available immediately at **every** configuration, with all four cards
and any 2–6-bar map. The current brief is an invitation; creation is never marked.
All 5,456 supported maps are valid storage objects, not ranked musical answers.

## Three operations and useful play

- **Utforsk og løys / Explore and solve:** compare concrete graphical maps under
  the displayed brief; select **all** valid maps. Two valid choices are intentional.
- **Bygg forma / Build the form:** fill/replace numbered slots with reusable cards;
  rearrange with Move left/right and undo. Accept every map satisfying the brief,
  rather than one hidden target order.
- **Skap og revider / Create and revise:** make a 2–6-bar piece-map, keep a
  before-version, replace/move a section and compare. Explicit save is optional.

There is no listening gate, speed bonus, compulsory sequence, score unlock or
promotion. A new trial rotates the three candidate positions; it does not pretend
to introduce new repertoire. Actual pitch/beat diagrams remain present so the
relationships refer to material rather than only letter strings.

## Eleven worked cases frozen before runtime code

IDs below refer to the exact quarter-note material above. All other maps can still
be musical; the accepted set concerns only the stated structural brief.

| Case | Operation/configuration | Offered/trial material and brief | Complete accepted set / useful feedback |
| --- | --- | --- | --- |
| 1 | Puzzle, 1 | Exact repeat: AA, AB, BB. | AA and BB. Compare all four pitches/rhythm; AB contrasts. |
| 2 | Puzzle, 1 | Contrast: AB, BA, AA. | AB and BA. AA repeats instead. No untaught prime distractor. |
| 3 | Build, 1 | Repeat; two slots, reusable A/B. | AA, BB; both accepted, out of four pairs. |
| 4 | Build, 1 | Contrast; two slots, reusable A/B. | AB, BA; no hidden preferred ordering. |
| 5 | Puzzle, 2 | Return: ABA, BAB, AAA. | ABA, BAB. AAA repeats but lacks a contrasting middle. |
| 6 | Build, 2 | Return; three slots, reusable A/B. | Exactly ABA and BAB out of eight maps. ABB does not return. |
| 7 | Puzzle, 3 | Named variation: A–Av, B–Bv, A–B. | A–Av and B–Bv. Compare retained first three pitches and changed ending. |
| 8 | Build, 3 | Variation; two slots, all four cards. | Exactly A–Av and B–Bv out of sixteen maps. Av–A reverses the specified direction; AA misses the change. |
| 9 | Build, 4 | Choose contrast, then change to return. | Contrast AB/BA; return ABA/BAB. New brief resets the objective trial, not the separate creation draft. |
| 10 | Any creation | Snapshot ABA, revise to ABAv. Also BBvAA or AA. | All supported 2–6-bar maps ungraded. Before/current may have different lengths; no inferred improvement. |
| 11 | Separate visual model | X=D4 E4 G4 A4; Xv=D4 E4 G4 G4; Y=A4 G4 E4 D4; Yv=A4 G4 E4 C4. Every event one quarter note. | XX repeats, XY contrasts, XYX returns, XXv varies. Same shared scale. Demonstration-only material, not selectable or stored. |

The different X/Y model explains the relationship without merely pointing at a
current answer. Xv is not strictly rising. No sound or teacher narration is implied.

## Accessible editing decisions

Candidate cards are noninteractive figures with a separate selection button;
never nest buttons. Native slot buttons announce selected chronological position;
Place replaces that slot **without automatic advance**. Cards are reusable. Move
swaps neighbours. Undo restores up to twenty placement/replacement/move/length
edits in the current session. If a control becomes disabled or a slot disappears,
focus falls back to the selected enabled slot.

Before/current maps have separate headings and numbered slots. A second snapshot
explicitly replaces/announces the old before-version. Creation and before-version
survive mode, configuration and brief changes within the session. Only explicit
saves survive reload/language navigation. All maps wrap chronologically on phones;
a new row does not mean a new phrase. Controls are at least 48px. Colour, SVG,
hearing, dragging, animation and motor speed are not prerequisites.

Feedback locates pitches/rhythm for repeat, base material/contour for contrast,
ends and middle for return, and base→changed-ending for variation. Missing as well
as extra puzzle selections are checked. Unlimited models/hints are not penalised
or used to infer ability. No structural failure means “bad music”.

## One short recommendation and transfer

**Illustrative, not teacher endorsement or permission to assign this prototype:**
“Formverkstad → Build the form → configuration 2. Build A–B–A, swap families to
B–A–B and compare. After this one exercise, stop within 3–5 minutes, even with a
question.” No account, teacher administration, score, save or tour of all modes is
needed. Longer creative play is optional; pupils retain enabled-level choice.

Optional off-screen challenge: invent/sing/play a short A, contrasting B, then A
again (**A–B–A**) in a comfortable register/pulse. Or retain three notes and change
an ending. Rhythm instruments may invent contrasting rhythmic sections; that does
not validate these pitched contours. The app does not assess or record the attempt.

## Integration and independent PR boundary

Stable auxiliary ID `form`, home card and Continue follow the existing Phrase
Puzzle convention. Do not rename Theme 03/04 or change the two-theme numbering.
Branch from main; **no merge, cherry-pick, modification or code extraction from
PR #15**. Shared hooks are unavoidable but explicit; see [integration plan](integration.md).

Optional `formPractice` version 1 records bounded puzzle/build practice and up to
20 saved `{level,map,previous}` objects. Missing older-backup extensions preserve
newer Form work; explicit valid confirmed imports replace it; invalid imports are
atomic. Damaged storage is not overwritten. School-disabled history stays
exportable; reopening is guarded. Configuration remains separate from pupil data.

School schema 3 adds `formEnabled` and `levels.form`. New defaults enable the
implemented prototype; schema 1 migrates with Form **disabled**, preserving all
old selections. Schema 2 is unsupported here: it belongs to separate draft PR #15.
No conversation module/content is enabled. Prototype availability never changes
release approval. CSP, allowlists, required evidence and release decisions remain.
