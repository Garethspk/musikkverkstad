# Week 3 pre-code design — Issue #27

Base main `afb44ea29ec9ffab85ebd9d40d1e9fa096b7cfb7`. Three independent optional
3–5-minute entrances in the existing weekly programme. No Week1/2 prerequisite,
calendar/timer/unlock or requirement to do all tasks. Default teacher suggestion:
Notation debugger → repair one measure, compare and stop, even with a question.
Human translation/music/TA1–TA5/AT/device/pupil validation PENDING; release BLOCKED.

## Scoped reuse, not duplicate engines

**Melodic response:** Theme03's existing ending brief: call C4 D4 E4 G4, four
quarter notes,90BPM, no intro/count-in, one silent beat between call and response.
Retain first3pitches and all durations; change only last pitch. C4 D4 E4 A4 and
C4 D4 E4 C4 both fit; exact echo C4 D4 E4 G4 does not. Of the existing allowed
last notes C4,D4,E4,G4,A4, every one except G4 is valid. Enter actual build mode,
ending brief, only an independently enabled Conversation configuration1/4, with
programme also enabled. Other Theme03 configurations are different briefs; explain
unavailability rather than force them. Existing source controls remain free choices;
context must distinguish further exploration/Echo from the specific Week3 brief.
No new audio engine, Week3 hearing/mastery score or duplicate saved responses.
Preserve existing explicit saves and stashed creative drafts when entering.

**Form construction:** enter actual Form build mode with return brief, only an
enabled Form configuration2/4. Build A–B–A or B–A–B; both accepted. AAA lacks the
opposing middle, ABB lacks literal return. Existing fixed musical palette and
before/current saves stay in Form's own archive. Programme consent is additional,
not a substitute for Form consent/levels. Keep visible context/return to Week3;
source exploration must not be falsely labelled successful Week3 construction.

## Notation debugger — exact worked cases before code

A full measure in4/4; quarter=1beat, eighth=.5, dottedquarter=1.5, half=2,
dottedhalf=3, whole=4. Use integer half-beat ticks internally. N means sounding
note, R means rest; rhythm-only notation does **not** imply a pitched clef/staff,
instrument fingering or auditory performance. State this explicitly and supply
standard duration/rest symbols plus exact text. No ties in this bounded bank;
never draw separate attacks as tied notes. No notation-reading speed requirement.

Select a numbered event, edit its duration or permitted note/rest role with native
buttons, inspect live total, undo/reset, optionally retain before/current and save
an explicit repair. Locked events remain visible with textual explanation. Keep
the original faulty measure visible for comparison. Check accepts all alternatives
meeting the exact brief, not one aesthetically preferred rhythm. No choices listing
complete answers instead of construction. All original measures remain structurally
invalid for their own brief, including an exactly4beat measure missing a requested rest.

| ID | Original events (beats) | Editable events and rule | Complete valid alternatives |
| --- | --- | --- | --- |
| debug-1 | N1 N2 N2 =5 | Change exactly one duration; choices .5,1,2; all3positions editable, roles fixed | N1 N1 N2; N1 N2 N1 |
| debug-2 | N1 N1 N1 =3 | Change exactly one duration; .5,1,2; all3editable | N2 N1 N1; N1 N2 N1; N1 N1 N2 |
| debug-3 | R2 N2 N1 =5 | Keep opening2beat rest and final1beat note; edit middle duration .5,1,2 | R2 N1 N1 |
| debug-4 | N1.5 N.5 R1 N.5 =3.5 | Keep opening dottedquarter+eighth; change exactly one final duration .5,1,1.5,2; roles fixed | N1.5 N.5 R1.5 N.5; N1.5 N.5 R1 N1 |
| debug-5 | N1 R.5 N1 N1 N1 =4.5 | Keep eighth rest; change exactly one of4note durations .5,1,2 | N.5 R.5 N1 N1 N1; N1 R.5 N.5 N1 N1; N1 R.5 N1 N.5 N1; N1 R.5 N1 N1 N.5 |
| debug-6 | R2 N.5 N.5 R.5 =3.5 | Keep opening halfrest; change exactly one remaining duration .5,1,2; roles fixed | R2 N1 N.5 R.5; R2 N.5 N1 R.5; R2 N.5 N.5 R1 |
| debug-7 | N1 N1 N1 N1 =4 | Keep all durations; change exactly one attack to a1beat rest for this stated space/breath brief | R1 N1 N1 N1; N1 R1 N1 N1; N1 N1 R1 N1; N1 N1 N1 R1 |
| debug-8 | N3 R1 N1 =5 | Keep final rest/note; edit opening duration .5,1,1.5,2,3,4 | N2 R1 N1 |

Counterexamples: unchanged originals; wrong total; more than one changed event even
with total4; changed locked event; note-for-rest swap except debug7; debug7 unchanged
has correct total but misses the explicit rest. A rest need is this brief's creative
constraint, never a universal rule that a four-note measure is bad music.

Eight cases vary over/underfill, fixed rests, subdivision/dotted relationships,
number/location of edits and a structurally different role fault. They are not
cosmetic transpositions. Every duration is represented accurately; proportional
beat strip and numeric text distinguish onset/time from symbol spacing.

Four freely chosen configurations:1guided total/constraint cues,2diagnose original
before live total reveal,3compare before/current repairs with an initial before-snapshot and same editor,4choose
case/constraint. Every configuration can reach all8cases; difficulty is scaffolding
and agency, not longer prose or narrower school bypass. No compulsory sound.

## Integration/archives and review obligations

School schema6 fields/IDs/migrations unchanged; programme toggle/levels govern all
three implemented weeks. Separate optional version1 `week3Practice` stores preferred
configuration, completed debugger counts and bounded explicit repairs with exact
slot/type/challenge/revision/level, event array and optional previous version.
Source Conversation/Form remain in their existing archives, never copied/regraded.
Missing older extensions preserve each module independently; all64subsets across
GR/CV/Form/Week1/Week2/Week3 must be tested. Explicit valid replaces after existing
confirmation; cancellation or any malformed sibling causes no mutation. Corrupt raw
storage is protected; quota/denied storage preserves memory/export without false save.
Current restrictions control reopen while disabled history stays exportable.

Review pre-code and actual source via four independent non-human music, curriculum,
inclusive game and QA roles. Exact finite repair sets, all locales, native keyboard/
touch, no audio for visuals, real source audio/cancellation, actual preview/ZIP and
teacher-kit exclusion plus full unchanged regression gate/CI are required. Simulated
Node tests, native Chromium, physical audio/device and human validation remain distinct.

Week4 is future only: author/review its mixed slots separately; do not add routes,
activity shells, prompt banks or enabled content during Issue27.

## Pre-code critique dispositions

Music independently enumerated the complete alternative counts2/3/1/2/4/3/4/1.
Debug7 is valid4/4 music missing this requested rest, not malformed notation. Standard
half/whole rest glyphs must show their reference line; dottedquarter rest and dottedhalf
note show actual augmentation dots plus text. CV build offers precisely the two A4/C4
ending fragments; four theoretical changed pitch endings belong to the predicate/free
creation range, not four available construction pieces. No tie/staff clef is invented.

Curriculum/game require original clearly labelled faulty-for-brief, explicit exactly-one
edit/locked-event constraints, optional private tap/instrument transfer without recording,
and source context that calls Echo/otherbriefs further exploration. Configuration2's
reveal is optional information, never a gate to editing or a screen-reader disadvantage.
The interaction remains construction: choose event, edit duration/role, compare, undo.
