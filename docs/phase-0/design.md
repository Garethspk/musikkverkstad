# Issue21 Phase0: one playable mixed week

Design revision1,23October2026. Source main8af7a24. Exactly three independently
accessible tasks; no PR15/PR20/PR9 merge or source copy. PR20 at911c359 is a read-only
planning input. Its week1 pulse/symbol/creative brief is developed here, not the
unrelated locally parked Issue19 draft. Human musical/teacher/pupil/device/access
validation PENDING; pupil release BLOCKED.

Week `pulse-space.v1` is an auxiliary programme, not Theme03 or a dated assignment.
Activity types `pulse-grid`, `rest-symbol`, `rhythm-create` differ from weekly slots
`w1-pulse`, `w1-symbol`, `w1-create`, curated challenge IDs/revision, pupil-selected
configurations1–4 and shared sequence/choice/grid-edit mechanics. No calendar locks,
score tour, prerequisite or implicit listening test. One3–5minute recommendation
per task. Main Theme01/02/Form and all their existing levels/history stay intact.

## Musical contract before code

All examples one4/4bar; quarter-note beat, MIDI60=C4, no pickup/count-in/hidden gap.
Visual tasks work without AudioContext/sample access. Optional rhythm audition at90
uses exact note/rest durations, shared native piano transport and Stop/cancellation.
Physical tapping/model inspection is optional and never automatically assessed.

1. **Pulse trail**: place beat numbers under a visible event grid. Notes, held
   durations and rests all consume pulse. Config1: four quarter cells, labels1–4.
   Config2: same4cells with2beat sustains, second cell labelled held/not reattack.
   Config3: eight half-beat cells, labels1,&,2,&,3,&,4,&. Config4: choose one of these
   briefs. Four original patterns per brief (12fixtures), independently checked.
   Accept exact chronological labels, not attack-count numbering. Hint explains a
   rest does not remove a beat. Placement/replacement/undo and supplied model.
2. **Symbol mechanic**: fill a declared silent span in a complete4/4bar. Config1:
   gap1quarter-beat → quarter rest;2: gap2beats → half rest;3: gap.5beat → eighth
   rest, other material fills3.5;4: choose brief. Four candidates each: quarter,
   half,eighth rest and quarter note. Exactly one matching rest; note of matching
   length fails silence requirement. Four context variants per brief (12); half rests occupy0–2 or2–4 only.
   Original inline SVG plus equivalent names/durations; this supports symbol/value
   relationships, not proof of unaided reading or hearing. No compulsory sound.
3. **Rhythm workshop**: make a one-bar binary rhythm, snapshot before, change,
   compare/undo, keep either and explicitly save. Config1:4quarter cells;2:same
   grid, choose same-attack-count revision intention;3:8half-beat cells;4:choose
   brief/division. All binary patterns including a full silent bar are ungraded
   supported compositions, never judged aesthetically. Space/retention briefs are
   invitations. Four quarter-grid and four eighth-grid supplied models; own work optional. Playback of
   silence reports silence honestly without fake audio success. Explicit saves
   include current+optional before-version; new format separate from old Theme02.

NN/NB/EN prompts, controls, feedback, help, stopping/transfer statements and access
names are authored together. Shared native buttons at least48px, visible selected
state, no colour/drag/speed requirement, text chronology and focus restoration after
rerender/undo. Three task entrances stay visible. Stop after one pulse reconstruction,
one symbol decision, or one chosen revision within3–5minutes, even uncertain.

## Availability, persistence and compatibility

School schema5 adds independent `programmeEnabled` and `levels.programme`;3/1
validate against their own historical exact root/registry before migration to5
with programme disabled. Preserve valid logos/branding/language/restrictions; old1
also keeps Form disabled. Draft schema4/2 remain unsupported (Conversation absent);
never reinterpret them as main. Schema5 is deliberately distinct from PR15's4;
future combination needs explicit reviewed new migration. New default prototype
includes implemented week only, not future weeks. Adult teacher kit disables both
programme and Form, remains Theme02-only. Preview/export must use same loader and
allowlist/CSP; no editor in pupil output, no external services/new assets.

Optional `programmePractice` v1 in existing progress/backup root: selected level,
bounded objective completion counts per slot/config, up to20 explicit creations
with stable slot/challenge revision, selected brief and divisions/pattern/before; no identity,
timestamp, score of physical skill or automatic unfinished-round resumption.
Missing older extension preserves newer work; explicit valid confirmed field replaces;
invalid sibling rejects entire import before mutation; cancel changes nothing.
Raw corrupt storage protected, denied/quota storage retains temporary work/export.
Language/branding/config changes preserve saved work and preferences; disabled
programme/level cannot reopen, history remains exportable. Navigation Continue
remembers task/config only, never unfinished answers. Drafts/snapshots are session
only until explicit save. Save must not overwrite old Theme02 or Form archives.

## Acceptance and staged follow-up

Independent predicate/fixture tests:12pulse examples,12symbol examples, all256binary
8cell patterns and16four-cell patterns incl silence, all levels/locales; chronology,
held-vs-attack semantics, duration sum4, complete offered sets, exact SVG/text data,
old migration/corrupt/import atomicity and school restrictions. Native desktop/mobile:
three independent entrances, keyboard/touch, no-audio visual path, optional native
sample playback/Stop/navigation/late-loading cancellation, saves/languages/backups,
admin opt-out/migration, opaque preview/extracted ZIP and adult-kit isolation.
Run all original regressions/full gate/CI, never waive managed file-policy failures.
Native signal checks are not speaker/human/physical-device evidence.

Weeks2–6 are written follow-up only:2mainForm repeat/contour plus practice-plan
case;3notation duration repair/mainForm return, Conversation slot BLOCKED pending
PR15;4return/expression storyboard/rhythm construction;5variation/staff landmarks/
ensemble roles;6groove repair/Formvariation/interpretation scenario. Each next
increment needs exact8–12worked cases per new musical slice, independent musical/
interaction checks, full locales/rights and relevant human reviews; not18 shells
in this PR. PR20 later matrix remains planning, not validated material. Owner review
of this draft is not merge/deploy/pupil approval. Two repair/review passes maximum
per batch; unresolved critical findings stay held.

## Frozen fixture inventory and accepted sets

`src/programme-core.js` is built-in canonical data, not imported executable content.
Each challenge has stable ID/revision1. All totals4quarter-beats. Event notation
here is `(sounding MIDI or rest, duration)`; no implicit onset/gap. Adjacent active
creative cells are separate attacks, never ties. Every pulse task accepts exactly
its chronological labels:1,2,3,4 for division1 or1,&,2,&,3,&,4,& for division2.
Repeated & values are interchangeable, not uniquely identified tiles.

| Challenge IDs (suffix0–3, in order) | Exact original material |
| --- | --- |
| pulse-quarter-0…3 | Binary quarter patterns1010,1101,0101,1001. Each1=C4/1,0=rest/1. |
| pulse-held-0 | C4/2,rest/1,C4/1. Second cell holds, not reattacks. |
| pulse-held-1 | rest/1,C4/2,C4/1. Third cell holds. |
| pulse-held-2 | C4/1,C4/1,C4/2. Fourth cell holds. |
| pulse-held-3 | C4/2,rest/2. Holds/rests all consume pulse. |
| pulse-half-0…3 | Binary half-beat patterns10100010,01101100,11010010,10001001. Each event.5beat. |
| symbol-0-0…3 | Gap1beat at0,1,2,3; remaining before/after span each one C4 sustain where nonzero. Quarter rest only accepted. |
| symbol-1-0…3 | Gap2beats at0,2,0,2. Cases0/1 have one surrounding C4/2; cases2/3 have two surrounding C4/1 attacks. Half rest only accepted. |
| symbol-2-0…3 | Gap.5beat at0,.5,2,3.5; remaining before/after span each one C4 sustain where nonzero. Eighth rest only accepted. |

Symbol candidates always quarter rest1,half rest2,eighth rest.5,quarter note1.
The quarter-note distractor isolates silence from duration in configuration1; in
others it fails duration too. Half rests sit on the middle staff line; they do not
hang like whole rests. Text names/values and visible canonical event timeline are
equal aids, not evidence of unaided score reading. The contextual half-rest variants
remain visibly different (sustain vs reattack) without enabling audio.

Creative models reuse four quarter patterns and four half-beat patterns above.
Configuration2 changes revision intention rather than claiming new repertoire.
All16four-cell and256eight-cell compositions, including silence, are structurally
valid; no asserted creativity, taste or physical-performance score. Physical-device,
actual speaker/perceptual, human translation and teacher-adoption review remain
PENDING. The [independent review record](reviews.md) distinguishes actual finite,
simulated-controller and native-browser checks.
