# Musikkverkstad — established project requirements

This document records requirements agreed in the development conversation.
Requirements are goals, not claims that every feature is implemented. See
PROJECT_STATUS.md for the actual exported state.

## Learners and learning

- Initial audience: ages 11–13 with some musical experience.
- Optional enrichment parents can make available to interested children.
- Game-like, self-directed in-app activities supporting musical understanding,
  aural skills and later instrumental practice; not an obligatory linear course.
- Organise content as themes, usable roughly weekly but freely selectable.
- Three clear activity entrances per theme: listening, reconstruction/problem
  solving, and creation. Show these consistently; do not hide choices to simplify
  onboarding. Use a larger reusable activity bank rather than inventing three
  entirely new mechanics every week.
- Differentiation within every activity; four levels/configurations currently
  used. Learners choose levels. Suggestions may help, but do not automatically
  move pupils or equate theme numbers with ability.
- Start here provides a suggested entry; Continue remembers location/level.
- Use tonal context when asking about chord function. Explicitly explain intro
  chords/count-ins/pauses and distinguish them from the material being answered.
- Exactly valid accepted answers for objective questions; choices must differ in
  actual heard content. Creative tasks accept multiple musical solutions and
  must not invent a single aesthetic correct answer.
- Clear instructions, retry/hints/replay, useful feedback, recovery from mistakes,
  clear stopping points. Completion counts are practice evidence, not mastery.

## Content direction (planned, not all implemented)

1. Same start, different ending.
2. Find the groove.
3. Musical conversations: compare call/response, reconstruct a response from
   short fragments, create a response. Make objective comparison definitions clear.
4. Home and away: harmonic function, tension and resolution.
5. Build a band: bass and musical layers.
6. Make it expressive: dynamics, articulation and tempo.
Long-term goal: a full year with varied recurring activity families.

## Interface and languages

- Nynorsk, Bokmål and English throughout; natural Nynorsk, 'me' when appropriate.
- Visible language label 'Språk', not NN/B/E abbreviations; full names in menu.
- Compact single header row suited to phones; numbered theme dropdown and previous/
  next controls. Avoid consuming excessive vertical screen space.
- Familiar consistent studio styling, readable contrast/type, clear selected state,
  large touch controls, keyboard labels/focus, no drag-only required interactions.
- Three activity controls visible near the top in every theme.
- Preserve the existing app's design and interaction conventions as it develops.

## Technical and privacy

- Standalone/downloadable use is a long-term goal; original mini-app preference
  was one offline HTML file. Current hosted implementation is multi-file with
  same-origin audio; preserve actual architecture during migration, do not pretend
  single-file/offline packaging is complete.
- No pupil accounts, microphone recording, analytics or transmission of pupil data.
- Keep learner work local unless a separately reviewed design authorises otherwise.
  Do not add identifiable child data, tracking or cloud synchronization casually.
- Reliable browser/phone audio from a piano sample set (selected sound C), avoiding
  accidental fallback to synth tones. Preserve attribution/license files.
- Explicit load/play/stop/failure feedback; safe cancellation on navigation and
  hidden page; no overlapping stale playback or silent fake success.
- Validate imported/saved data, handle denied browser storage, preserve old valid
  progress during migrations, and disclose exactly what Export/Import includes.
- Do not modify or deploy to the existing Work Site as part of migration.

## Development and quality

- Work autonomously on authorised scope, with independent teacher/fact-check and
  bug/test review. Minimise repeated user debugging and unbounded review loops.
- Check every new activity's generated examples, accepted answers, actual note
  sequences, differentiation, translations and failure/cancellation paths.
- Preserve meaningful existing regression tests and release gates in AGENTS.md.
- Code/build failures block release. Missing browser/device evidence must remain
  visible and cannot be replaced with mocked evidence or a simulated pupil claim.
- Separate automated logic/scheduling checks, rendered browser checks, audible
  device checks and real pupil evaluation in reports. Never claim unperformed tests.
- Aim for automated dependable release checks before scaling to a full year;
  that automation is not yet complete.
