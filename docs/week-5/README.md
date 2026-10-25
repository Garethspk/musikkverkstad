# Week 5 — one parameter, staff landmarks and ensemble roles

Issue #31 starts from main `4c41d6a` (merged PR #30). The approved
[six-week backlog](../programme-52/first-six-weeks.md) and
[weekly matrix](../programme-52/weekly-matrix.md) were read before design/code.
[Frozen worked examples](design.md) and [four independent AI critiques](reviews.md)
record the C3/N1/I2 objectives, justified refinements and exact musical rules.
Only Weeks 1–5 are implemented; Week 6 remains a proposal. Human validation PENDING;
pupil release BLOCKED. No merge, deployment, distribution or change to PR #9.

## Three independent short choices

**Motif laboratory (C3):** select individual note events and deliberately transform
pitch while retaining durations, or redistribute durations while retaining pitches.
Compare source/current components, maintain one 4/4 bar, snapshot/revise/Undo and
save a version. The first case retains C4–D4–E4 and changes the final G4, including
the planned A4 alternative. Eight exact briefs cover different retained regions and
rhythmic transformations. In motif-4, one parameter changes at TWO pitch positions;
“one change” is not a promise of one changed note in every brief.

Simply reopening Week 3's audio changed-ending exercise would duplicate it. The
refinement keeps its planned objective but introduces component auditing and valid-
to-valid rhythmic transformation. It differs from fixing Week 3's invalid bar and
from Week 4's variable-tile insertion. An explicit ungraded Free mode accepts any
supported complete four-note bar, including the unchanged reference; it does not
claim all such variants retain the same perceived identity or have equal quality.
Mode switching clearly resets the unfinished session draft while saved work remains.

**Staff landmarks (N1):** place two requested pitches on a real treble-clef staff,
select the current target and move by named positions/up/down. Start with C4 ledger
below and G4 second line. Eight cases introduce lines/spaces and optional upper/lower
landmarks without automatic promotion. A stable shared pitch-position scale and
complete accessible text reference describe every line, space and ledger. NN/NB H4
is EN B4, with the naming convention explained. Noteheads show pitch only; no rhythm,
instrument fingering or transposing-instrument sound is implied. Supported lookup is
valid practice, not proof of independent reading mastery. This is new staff placement,
not the earlier symbol choice, contour comparison or duration repair.

**Ensemble roles (I2):** assign four unnamed parts A–D to melody, answer, pulse marks
or waiting, then compare a common two-bar schedule. Six original contexts vary note
lengths, unison doubling, handover, sparse/paused pulse parts and delayed entries.
Every model pair changes one part; actual consequences update with every allocation.
All configurations expose factual present/absent roles and contextual entries. Any
well-formed allocation, including four waiting parts, can be saved without correctness,
aesthetic score or completion credit. It does not necessarily fulfil every scenario.

Unnamed parts refine the planned instrument allocation to avoid instrument stereotypes,
unsupported ranges or transposition claims. Several performers can choose the same
written role, giving actual unison or duplicated markers. Optional teacher-guided
voice/appropriate instruments/tapped pulse are off-screen transfer, not assessed by
the app. This introduces layering and timing decisions beyond Week 2's practice
planner and Week 4's dynamics storyboard. Six contexts meet the proposed 6–10 creative
brief range; they are not claimed as six unrelated mechanics.

Choose one activity for 3–5 minutes and stop after one comparison/revision, even with
a question. Concrete teacher recommendations: Motif1 retain the opening/change the
ending; Staff1 place C4/G4; Roles3 change part B from melody to answer and inspect
entry. Current case numbers and a short-teacher-choice button are available in every
allowed configuration without changing the pupil’s chosen level. No prerequisite,
timer, streak, compulsory tour or three-task sequence. Four
pupil-chosen configurations offer real support/agency, not a measured ability label.
NN/NB/EN, native keyboard/touch controls, stable focus, 48px targets, text/border
selected states and full text alternatives preserve the studio design.

## Finite musical and graphical contract

Motifs have four events from C4/D4/E4/F4/G4/A4 and half-beat tick lengths 1/2/3/4.
Eight ticks fill 4/4. Brief answers total 5/5/5/25/2/2/2/2 =48. The complete free
domain is 31 duration tuples ×6^4 =40,176 bars. Intermediate totals 4..16 ticks
remain editable and show their actual budget; only complete valid bars can be saved.
Locks prevent accidental changes to retained parameters. A half note is one attack
held for two beats; a dotted quarter is one note lasting one and a half beats.

Staff positions C4..A5 use the exact natural-note MIDI scale, five equally spaced
lines at E4/G4/B4/D5/F5 and ledger lines at C4/A5. Each two-target case has exactly
one accepted pair among 13² complete placements; blanks remain editable drafts.
Unicode treble clef is rendered locally, following existing notation conventions;
numeric geometry is checked separately from actual rendered-glyph inspection.

Ensemble parts share 16 half-beat ticks across two 4/4 bars. Pitched notes/rests have
exact written onsets and durations. Pulse events explicitly have kind=pulse and
zero duration: markers specify an ATTACK, not a sustained sound length. The four
beats continue when a pulse part has no mark. Attack-free windows may contain held
notes; they must not be reported as measured silence. Six contexts ×4^4 =1,536 open
allocations remain ungraded. All exact sources, models and counterexamples are in
design.md. Original instructional examples/diagrams, no new external media or license.

## Compatibility, school consent and security

School schema6 IDs/fields/validators/migrations are unchanged; only availability
labels advance to Weeks1–5. Programme consent and enabled configurations govern all
three new neutral tasks, Continue, actions and reopening. They do not expose a
restricted Form/Conversation/Notation source exercise. Existing Form may be disabled,
Conversation omitted, and Notation configurations restricted (it has no disable flag
in schema6); each original route keeps those independent rules. Programme opt-out
blocks every Week5 action while valid stored work remains exportable.

Separate optional version1 `week5Practice` stores only objective practice counters
and explicitly saved pinned versions (30 cap). Slot/type/case/revision/mode/level
identities, event domains and before/current values are strictly validated. Free and
Roles have no objective done keys. Canonical duplicates reject regardless of event
property order; cloning prevents aliases. Wrong/partial staff or intermediate motif
totals may be before snapshots, but constrained saved current values must satisfy
the exact brief. Unknown IDs/keys/modes and malformed sibling data reject atomically.

Missing fields in older backups independently preserve Theme02, Conversation, Form,
Weeks1–5 (256 possible subsets) and Theme01/base progress. Explicit valid fields,
including empty, replace only after confirmation; cancellation/any invalid sibling
leave memory and raw stored bytes unchanged. Existing language/branding/configuration
changes retain valid histories; disabled work cannot reopen. Denied/quota storage
supports in-memory work/export, never a false claim of durable save. Drafts are not
autosaved; no new pupil identity, account, analytics, microphone or external service.

Existing source musical engines/banks and sound assets remain unchanged. No new
audio engine or compulsory playback. Teacher kit stays Theme02-only and denies
Week5 routes/actions. Actual opaque preview and extracted ZIP use compiled pupil
files without an administrator editor, preserving sandbox/CSP/local assets/offline
boundaries. Offline editing after HTML load is not proof of physical Windows/Edge
file use. All tests/timeouts/assertions/security/release decisions remain intact.

## Verification boundaries and next step

Independent numerical/predicate/Node VM checks, native rendered Chromium and real
teacher/AT/device/speaker evidence are different. Exact candidate Node/native/full-
gate/CI outcomes and every local policy failure/timeout belong in the draft PR.
Four source critiques and bounded repairs are recorded in reviews.md. No success
on a visual task verifies hearing, performance, engagement or learning transfer.
Human music/translation/teacher-adoption TA1–TA5/pupil/AT/device/speaker validation
remains PENDING; pupil release BLOCKED.

Week6 is a separate future increment: groove repair, form arranging and interpretation
scenario under the approved backlog. First freeze exact cases, distinguish them from
implemented weeks, review musical validity/creative freedom, retain school/archive/
security behaviour and run independent critiques plus full Node/browser CI. No
Week6 route, shell, prompt bank or enablement is implemented here.
