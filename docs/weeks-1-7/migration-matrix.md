# Authoritative seven-prototype migration matrix

The seven uploaded originals in latest-week-prototypes/ are retained byte-for-byte.
This inventory precedes integration code. The older six-week application is historical
context, not the source of these21 activities. No merge/deploy; human validation
PENDING, pupil release BLOCKED. The new trial permits all seven weeks independently;
within each week task2 requires task1, task3 requires task2. No completion bypass.
Completed tasks persist only in the open trial session; changing week resets unfinished
rounds/drafts, explicitly disclosed. Reset clears the session, never legacy pupil storage.

Build plan: scripts/build-seven-weeks.py bundles original HTML/CSS/JS plus reviewed
src/seven-week/week-N.js corrections and shared bridge into one offline HTML shell.
Only one opaque allow-scripts frame is active. The shell supplies one week/language
selector; prototype typography/cards/help/taskcontrols remain. Exact source mapping:

|Week/task|Original functions|Integrated correction module / acceptance tests|
|---|---|---|
|1 Hald pulsen|renderPulse/startPulse/onTap/scorePulse|pulse.js / week-1.js;12beat audio-aligned run,6 consistent beat positions across both final repeats, one fitted tempo/offset, no clickspam credit; native pulse tests|
|1 Finn noteverdien|seedQuiz/renderQuiz/onQuiz/noteSvg|week-1.js;5 correct note/rest duration answers, wrong/repeat lock|
|1 Bygg ein rytme|renderBuild/playBars/finishBuildRound|week-1.js;4 complete bars, edit then additional rest, completed playback eachstage, real loop|
|2 Høyr forskjellen|compareData/renderCompare/answerCompare|week-2.js;4 heard exact-match rounds, varied genuine distractors|
|2 Set frasane saman|phraseSet/renderOrder/checkOrder/phraseStaff|week-2.js;3→6→9 cumulative cards, notationfromstart, arrows/drag, oneplayer|
|2 Høyr og bygg|expectedMelody/renderMemory/checkMemory|week-2.js;3 consecutive fresh correct melodies, audible referencekeys|
|3 Finn tonen i notane|pickRound/match/staff/nextCorrect|week-3.js;3 heard contextual/reference pitch matches|
|3 Kva note er dette?|quiz/staff/nextCorrect|week-3.js;5 correct staff/name questions|
|3 Plasser tonen|place/update/nextCorrect|week-3.js;4 correct pitch placements, arrows/reference, reset-before-render fix|
|4 Bygg ein akkord|buildKeys/kb/drawBuild|week-4.js;4 target triads as sets, any selection order inclnonC|
|4 Utforsk akkorden|drawTransform/move/playChord|week-4.js;retain exploration/comparison/reconstruction, credit completed audition|
|4 Lag ein akkordprogresjon|drawSequence/playProgression|week-4.js;4 chords, original/change/compare, completed audio, modest finish|
|5 Høyr returen|differentForm/draw1/playMusic|week-5.js;3 heard return rounds, individually playable alternatives|
|5 Bygg musikken|initOrder/draw2/swapOrder|week-5.js;3 shuffled fourbar reconstructions, visible accurate card notation|
|5 Lag ein variasjon|draw3/updateCell/staff/playMusic|week-5.js;preserve exact pitch-up/down and q→pair→rest duration buttons;3 genuine stages/completed auditions|
|6 Same melodi – ulik klang|draw1/playTimbrePhrase/playTwoParts|week-6.js;same4notes/3voices, distinct assignments and completed individual/together playback|
|6 Kva lyd manglar?|layerPhrases/playLayers/draw2|week-6.js;4 rounds/3independent8-position melodic layers, listen and answer locks|
|6 Bygg eit lite samspel|makebar/draw3/schedule/advance3|week-6.js;4fourbeatbars, all3layers/nonemptybars, edit andplay thenfinalplay autoends, honestloop|
|7 Finn taktarten|fresh/phrase/notes/draw1|week-7.js;4 heard rounds, compound6/8accent0,3 not0,4|
|7 Flytt taktstrekane|draw2/barLines|week-7.js;exact boundaries3,6,9 then4,8 across12quarters, wrong/reset|
|7 Dansande taktar|initialise/changes/buildEvents/draw3|week-7.js;4bars3/4→4/4→6/8;accent/rest/edit rules, retained final grid, autoend|

## Pre-code defects and refinements to verify

Independent non-human music and stage reviewers inspected actual original functions.
They do not substitute human music/teacher/device validation.
- W2 low staff map places C/D too low; correct C4ledger70,D4=65,E4bottomline60.
- W3 staff mapping itself correct; placement state resets AFTER rendering next round.
- W4 any-order chord selection already correct in v5: preserve, regression-test.
- W5 pair notation steps diatonically while audio uses MIDI+2: share diatonic successor,
  including H→C and topboundary, without changing duration controls.
- W6 task1 credits playback at click; task2 permits rapid repeated answer credit;
  task3 uses one0.75s note per allegedbar and exposed loops are not genuine.
- W7 6/8 accents0,4 produce4+2 instead of3+3; protect0,3. No loop checkbox exists
  in actualW7v1, so no inert control should be added. Meter-specific fresh creation
  grids are intentional; clarify editbaseline is current4/4, not preceding3/4.
- All creative heard flags must reflect completed native playback and current revision;
  stop/edit/navigation/hidden-page invalidates stale callbacks. W1 pulse/build await
  resume races and livegrid scheduling require cancellation/snapshot checks.
- Stale delayed question transitions, rapid-answer clicks, language rerenders,
  keyboardSpace pulse and allhardcodedlabels need audit across21 activities.

Native browser tests use actual synth scheduling, never simulated results as device
or audible-speaker evidence. Original release gates remain intact; managed file://
policy failures remain FAIL. Full standalone file behavior requires permitted actual
Windows/Android testing and stays NOT TESTED until observed.
