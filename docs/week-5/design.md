# Week 5 frozen pre-code design — Issue #31

Base main `4c41d6a0459b0f7efeda51ba3ef7297335fe39cc` (merged Week 4).
Read first: [six-week backlog](../programme-52/first-six-weeks.md),
[weekly matrix](../programme-52/weekly-matrix.md), [activity types](../programme-52/activity-types.md).
Week 5 = C3 Motif transformation, N1 Staff landmarks, I2 Ensemble roles.
Week 6 remains documentation only. Four independent non-human critiques were completed before code. The numerical
banks below are frozen with the clarifications/API contract recorded at the end.
Human teacher TA1–TA5/music/translation/pupil/AT/device/speaker validation PENDING;
pupil release BLOCKED. No audio engine, deployment, distribution or PR #9 changes.

## Curriculum continuity and justified refinements

- C3's first worked case retains C4–D4–E4 and changes G4 to another pitch, including
  A4. Simply reopening Week 3's audio response would duplicate its one-ending brief.
  Instead pupils edit a four-event motif, compare retained/changed pitch and rhythm
  separately, and deliberately transform one parameter while retaining the other.
  Later cases redistribute duration in an already valid bar: this is transformation,
  not Week 3's repair of a broken bar or Week 4's insertion of rhythm tiles.
- N1 introduces actual treble-clef staff placement (C4 ledger and G4 second line first),
  not Week 1's symbol choice, Week 2's contour or Week 3's duration debugger. Pitch
  positions have a stable shared diatonic scale, clef/octave and full text equivalent.
- I2 introduces four-part role allocation and a shared two-bar timeline, not Week 2's
  practice-goal selection or Week 4's per-section dynamics. Pupils change one part,
  compare texture/timing and revise. All well-formed exploratory allocations remain ungraded.
  Six original creative briefs (the type contract proposes 6–10), not six supposed
  new mechanics. Consequences describe the written model, not measured performance.
- Three independent optional 3–5-minute entrances, no prerequisite/timer/tour. Stop
  after one construction/comparison, even with a question; longer exploration optional.
  All are new neutral programme tasks, not wrappers exposing disabled source exercises.
  Programme consent/levels apply. Existing Form/Conversation availability and Notation level restrictions,
  levels, audio, archives and their independent school guards remain unchanged.

## C3 — motif laboratory: exact finite contract

Pitch palette MIDI `[60,62,64,65,67,69]` = C4 D4 E4 F4 G4 A4. Four note events,
`{notes,ticks}`; one tick = half a quarter beat. A 4/4 bar totals eight ticks.
Duration palette `[1,2,3,4]` = eighth, quarter, dotted quarter, half. Every note has
one attack and its full duration. No rests/chords/accidentals in this bounded lab.

In Brief mode the named parameter and editable indices alone may change; every
listed editable component must actually differ, all others remain literal. Pitch
briefs retain all durations; rhythm briefs retain every pitch. Total must remain8.
Intermediate duration totals may be wrong: show the actual budget, never clip/award
credit/save until valid. Objective success is only satisfaction of this stated brief.
Free mode is separate and ungraded: all6^4 ×31 =40,176 valid four-note bars allowed,
including the unchanged source; it is not a universal taste/identity judgement.

| ID | Source pitches | Source ticks | Change parameter / zero-based indices | All valid brief variants |
|---|---|---|---|---|
| motif-1 | 60,62,64,67 | 2,2,2,2 | pitch / 3 | final in60,62,64,65,69:5 |
| motif-2 | 67,64,62,60 | 2,2,2,2 | pitch / 0 | initial in62,64,65,67,69:5 |
| motif-3 | 60,64,62,67 | 1,3,2,2 | pitch / 1 | second in60,62,65,67,69:5 |
| motif-4 | 62,64,67,69 | 2,2,2,2 | pitch / 2,3 | third≠67 AND fourth≠69:25 |
| motif-5 | 60,62,64,67 | 2,2,2,2 | rhythm / 0,1 | ticks1,3,2,2 or3,1,2,2:2 |
| motif-6 | 67,65,64,62 | 1,3,2,2 | rhythm / 2,3 | ticks1,3,1,3 or1,3,3,1:2 |
| motif-7 | 60,64,67,64 | 2,1,3,2 | rhythm / 1,2 | ticks2,2,2,2 or2,3,1,2:2 |
| motif-8 | 62,65,69,67 | 2,2,2,2 | rhythm / 0,3 | ticks1,2,2,3 or3,2,2,1:2 |

Total48 constrained variants. Source unchanged, a change to a locked field, only
one changed index in motif-4, wrong total or out-of-palette event are counterexamples.
Editor: select event, choose allowed pitch/duration, Undo/reset, before snapshot,
explicit save/reopen. Compare/audit names retained/changed components and onset/hold
consequences. No claim that a screen edit verifies heard identity or instrumental transfer.
Configuration1 locked/editable text;2 full component audit;3 prepared before snapshot;
4 case choice. Core operations remain accessible in each configuration. Free switch
starts a fresh session draft, not deletion of saved work; returning to Brief resets
its constraints predictably. No grading or objective done key in Free mode.

## N1 — staff landmarks: exact mapping

Treble/G clef, no key signature/accidentals. Scientific octave: middle C is C4.
Norwegian H4 = international B4; use H4 in NN/NB and B4 in EN, explain the convention.
Diatonic positions0..12 from C4 to A5 map to MIDI
`[60,62,64,65,67,69,71,72,74,76,77,79,81]`.
Staff lines bottom-to-top positions2/4/6/8/10 = E4/G4/B4/D5/F5.
C4 position0 is a ledger below, D4 position1 below staff, A5 position12 a ledger above.
Use constant spacing: C4 y118, every diatonic step moves5px upward; staff line y108,
98,88,78,68. G clef anchors G4 at y98 (same glyph placement as existing notation
renderer, translated vertically); C4/A5 ledger lines y118/58. Noteheads mark pitch
only, not durations, metre, instrument fingering or transposing-instrument sound.

| ID | Two targets | Exact positions |
|---|---|---|
| landmark-1 | C4,G4 | 0,4 |
| landmark-2 | E4,B4 | 2,6 |
| landmark-3 | F4,A4 | 3,5 |
| landmark-4 | D5,F5 | 8,10 |
| landmark-5 | D4,C4 | 1,0 |
| landmark-6 | A4,C5 | 5,7 |
| landmark-7 | G4,D5 | 4,8 |
| landmark-8 | E5,A5 | 9,12 |

Place each target, then adjust using named position buttons or up/down one step.
Blank/incorrect positions stay editable; only the exact pair satisfies the brief.
Independently enumerate13² placements per case, plus null/partial drafts. Full text
alternative describes lines/spaces/ledgers in bottom-to-top order; selected state is
text+border, not colour alone. Text help is legitimate support, not a penalised cheat.
Config1 all pitch-position labels;2 C4/G4 anchor distances;3 line/space/ledger guide;
4 case choice. The same exact mapping applies throughout; no automated promotion.

## I2 — ensemble roles: six exact two-bar contexts

Four unnamed parts A–D (no pupil names). Each chooses one of four roles:
`melody`, `answer`, `pulse`, `space`. Multiple melody parts are literal unison;
multiple answer/pulse parts duplicate their respective written pattern. No instrument
stereotypes/range claims. Imagine/tap/sing/play only as optional off-screen transfer,
with no recording or assessment. Every4^4=256 allocation is structurally representable and saveable,
including four silent parts; this does not mean every allocation fulfils the prompt
or is universally musically coherent. Diagnostics describe coverage, not a taste score.

Two bars of4/4 =16 half-beat ticks. Melody fills bar1 (ticks0..7), answer bar2
(ticks8..15) except its explicitly listed leading rest. All remaining time is rest.
Pulse marks are attacks at the listed half-beat offsets; they are not a sustained
pitched line. Text and common-scale timeline show exact onset/duration/rest positions.
Any attack-free beat summary must say held notes can continue; never call it measured
silence. Melody/answer note durations are held in the written model only.

| ID / musical question | Melody pitches / ticks | Answer pitches / ticks (bar2) | Pulse onsets | Model0 → Model1 (parts A,B,C,D) |
|---|---|---|---|---|
| roles-1 / Double the call or leave one part space? | 60,62,64,67 /2,2,2,2 | 67,64,62,60 /2,2,2,2 |0,2,4,6,8,10,12,14|melody,answer,pulse,space → melody,answer,pulse,melody|
| roles-2 / Add an answer over a spacious pulse? |64,67 /4,4|67,65,64,62 /2,2,2,2|0,4,8,12|melody,pulse,space,space → melody,pulse,answer,space|
| roles-3 / Change unison support into a handover? |60,64,67,64 /2,2,2,2|62,65,69,65 /2,2,2,2|0,2,4,6,8,10,12,14|melody,melody,pulse,space → melody,answer,pulse,space|
| roles-4 / Answer or a whole empty second bar after the pulse part pauses? |67,64,62,60 /2,2,2,2|60,62 /4,4|0,2,4,6|melody,answer,pulse,space → melody,space,pulse,space|
| roles-5 / Does pulse bridge a delayed entry? |62,64,65,69 /2,2,2,2|rest4 then69,67,65,64 /1,1,1,1|0,2,4,6,8,10,12,14|melody,answer,pulse,space → melody,answer,space,space|
| roles-6 / Bring pulse in with the answer? |60,64,60,64 /2,2,2,2|67,64,67,64 /2,2,2,2|8,10,12,14|melody,answer,space,space → melody,answer,pulse,space|

Each pair changes exactly one part. Models are examples, never answer keys. Choose
part/role, compare the actual layered schedule, snapshot/revise/Undo/save; no Check
button or done credit. Source phrases are original finite instructional examples,
not claimed stylistically authentic performances. Config1 role legend;2 prepared
before snapshot with role counts;3 event-derived entry/attack coverage;4 case choice.
Six contexts ×256 =1536 open allocations, plus all explicit model pairs to test.

## Engineering and independent verification contract

New pure UMD/CommonJS `W5Core` and `week5` route, tasks `motif`,`staff`,`roles`.
No new theme dropdown entry/source audio engine. Reuse existing studio controls,
neutral note/duration/notation conventions, navigation/save/import patterns and local
packaging. Original musical engines/banks remain unchanged except weekly nav links.
School schema6 fields, IDs and migrations unchanged (label updates only).

Separate optional `week5Practice={version:1,level:1,done:{},creations:[]}` (30 cap).
Strict records `{slot,type,challenge,revision:1,level,mode,value,previous}`:
- w5-motif / motif-transformation / motif-1..8 / mode brief|free / four note events.
  Brief current obeys exact acceptance; Free current is any valid8tick motif.
  Previous null or structurally valid same-mode draft, including interim wrong totals.
- w5-staff / staff-landmark / landmark-1..8 / mode brief / exact current target pair.
  Previous null or two positions0..12|null; null current cannot be complete.
- w5-roles / ensemble-roles / roles-1..6 / mode open / four role IDs, previous same/null.
Done only constrained motif/staff, `w5-motif/motif-N/r1/lN` or
`w5-staff/landmark-N/r1/lN`, integer1..1e6; no role/Free aesthetic credit. Canonical
array/event-field duplicate keys, deep clone/no aliases, unknown IDs/version/keys reject.
Language, branding and school restrictions preserve/export archives; unavailable
records cannot reopen. Saved preference is not overwritten by clamping entry.

Missing older backup fields preserve each of eight module archives independently:
Theme02/Conversation/Form/Weeks1–5 =>256 subsets per locale, plus Theme01/base.
Explicit fields replace only after confirmation; any invalid sibling/cancel aborts
all memory/raw/Theme01 mutations. Corrupt raw storage and quota recovery remain intact.
No source progress copying, pupil identities, account, analytics or data transmission.
Teacher kit remains Theme02-only and denies Week5 actions. Test real opaque preview,
actual extracted ZIP, offline editing, CSP/editor exclusion, no new audio initialisation.

Native desktop/mobile viewports, keyboard Enter/Space/focus/48px/layout, NN/NB/EN,
all8+8+6 banks/models, wrong/interim/revision/alternative/free cases, histories/imports,
source availability/level restrictions, programme opt-out and teacher denial. Full Node suites and browser
CI on exact candidate; local default gate retains all tests/timeouts/security, reports
all file-policy failures and aggregate timeouts honestly. At most two repair passes
per batch; unresolved technical defects remain blockers, never fabricated passes.

## Pre-code critique disposition and frozen implementation API

Music, curriculum, inclusive/game and QA independently checked this proposal. Music
and QA independently enumerated all48 motif variants,40,176 free motifs, all staff
positions and1536 role allocations; no numerical discrepancy. Required corrections:
- “One change” means one parameter; motif4 explicitly changes BOTH final pitches.
- Underlying four-beat metre continues when the pulse PART has no markers.
- Pulse events have `kind:'pulse', ticks:0` (attack-only), not silent notes; no inferred
  sounding duration. Diagnostic windows say no NEW attacks; held notes may continue.
- All role allocations are well-formed exploratory plans, not verified fulfilment or
  universal musical coherence. No Check, correctness counter or completion claim.
- Every role configuration shows actual contextual/entry/unison/absence consequences
  immediately; before/current comparison identifies changed parts. All-space plainly
  reports absent melody/answer/pulse. Role edit prepares the first before snapshot.
- Concrete teacher choices: Motif1 change the ending and compare once; Staff1 place
  C4/G4 and compare once; Roles3 change partB from melody to answer, inspect entry, stop.
- Unnamed parts replace instrument allocation to avoid unsupported range/stereotype
  assumptions. Optional teacher-guided voice/appropriate instrument for pitches and
  tapped pulse remain unobserved transfer, not app assessment.
- Mode-reset warning appears BEFORE mode buttons. Only unfinished draft resets; saved
  work stays. Configuration changes preserve draft/selection and clamp before support.
- Staff has visibly selected target, named position/up/down controls and reference
  help in every configuration. Supported success is not independent-reading mastery.
- Native review must inspect the actual clef glyph/anchor/ledgers, not infer from y math.

Pure module global/CommonJS `W5Core` API (functions accept built-in item or its ID):
`week`, `slots`, `pitches`, `durations`, `motifs` ({id,revision,parameter,editable,original}),
`positions` (MIDI array), `landmarks` ({id,revision,targets}), `roles` (four role IDs),
`ensembles` ({id,revision,melody,answer,pulse,models,brief}), `clone`, `ticks`,
`motifDraft(item,value,free=false)`, `motifFits(item,value)`, `freeMotif(value)`,
`motifDiff(item,value)` ({pitch:[bool×4],rhythm:[bool×4]}), `staffDraft(item,value)`,
`staffFits(item,value)`, `rolesFits(item,value)`, `timeline(item,role)`,
`roleSummary(item,plan)`, `empty`, `valid`. All exported banks/API deeply frozen.
- Motif events EXACT `{notes,ticks}`; dense4 events. Draft ticks each1..4 => total4..16.
  Draft enforcement retains locked fields in Brief, skips locks in Free; total8 only
  for completed values. Diff compares literal components, not aesthetic identity.
- Staff targets MIDI, stored positions dense2 integers0..12 or null for drafts.
- Roles order `['melody','answer','pulse','space']`; dense4 IDs, no slot restrictions.
- `timeline` returns `{kind:'note'|'rest'|'pulse',notes:number|null,at,ticks}` events on
  ticks0..15: melody source then second-bar rest; answer first-bar rest then source
  (including leading rest in roles5); pulse attack-only zero-duration markers; space
  one16tick rest. Pitched note/rest durations are exact. Pulse markers do not imply
  a held length. `answer` includes `{notes:null,ticks:4}` before its four eighths in5.
- `roleSummary` returns role `counts`, `entries` (first actual attack per role or null
  when none assigned), `attackBeats` and `attackFreeBeats` numbered1..8. Duplicated
  parts do not change unique attack windows; entries derive from actual events.

UI global `w5`={task:'motif'|'staff'|'roles',level,index,value,event,target,part,mode,
previous,undo,recorded,message}; `w5Item`, `w5Reset`, `w5Action(action,value)`,
`w5View`, `w5Text`, `w5Empty`, `w5Valid`, `w5ImportReset`, `w5Card`, `w5Progress`.
Attributes `data-w5` action + `data-w5-value`, focus `data-w5-key`. Actions:
enter/task,level,next,case; motif event,pitch,ticks,mode brief|free; staff target,
position,up,down; roles part,role,model; shared undo,reset,snapshot,check,save,open.
Roles mode=open and staff mode=brief. Objective Check credits once per case round;
reset/undo/snapshot/mode switch do not clear that guard. Level choice retains draft
and does not automatically promote. Role first edit snapshots the prior allocation;
model1 prepares model0 comparison if none. No Check control/credit in Free or Roles.

Archive records contain exactly the8 named fields, dense arrays, exact typed event
keys, canonical [notes,ticks] duplicate signatures independent of property order,
cloned output and no alias. Source modules and school guards remain unchanged.

Schema6 clarification from native-test design: Form can be disabled and Conversation
can be omitted from themes. Notation has no on/off flag; its nonempty enabled-level
list (e.g. [3]) remains enforced. No nonexistent disable setting is fabricated.

## Actual-source repair1 (banks unchanged)

Independent source/native review found the inherited clef baseline did not anchor
the actual Chromium glyph correctly: spiral on B4 instead of G4. Week5 baseline
is corrected103→113, with staff/note/ledger geometry unchanged. Native screenshot
reinspection is required; font fallback on other platforms remains unverified.
Augmentation dot now sits inside the quarter-note SVG beside its notehead, not as a
vertical sibling. Timeline and attack-window display use bar-local coordinates;
core absolute tick/beat contracts are unchanged. Overflow warnings are conditional,
with a separately named fixed-scale overflow region. Current case number and a
recommended-case button work at every allowed configuration without promotion.
Role consequences/comparison precede large timelines for usable immediate feedback.
Archive challenge IDs now explicitly require strings: public predicate item-object
support must not admit object-valued saved IDs that cannot reopen. Independent
malformed-import regressions guard this genuine defect. No musical bank or accepted
valid-answer set changes. Small NN/EN attack/duration wording corrections included.
