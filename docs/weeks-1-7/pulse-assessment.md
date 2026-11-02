# Week1: Hald pulsen — human-test feedback correction

Development branch only. Human validation **PENDING**; pupil release **BLOCKED**.
This corrects scoring and feedback, not the original musical pattern or page design.

## Verified diagnosis and limits

The human tester reported eight registered taps across the final two repetitions,
without completion. The original integrated scorer required at least five taps
within175ms of a fixed550ms grid and a65% hit ratio. Eight perfectly steady taps
delayed220ms all fail that rule. A count alone cannot tell whether that particular
human performance was steady: its timestamps and device output latency were not
recorded, so the precise cause of that attempt remains unknown.

Playback was scheduled at `AudioContext.currentTime + .16`, but input, indicators
and finishing used an independently established `performance.now() +160` origin.
That approach omitted the audio output pipeline delay and assumed clock alignment.

## One audio-aligned timeline

The same elapsed-time function now drives tapping, visual beats, repetition count
and finishing. `getOutputTimestamp()` maps the audible audio frame's context time
to the performance clock. Input uses the event timestamp, normalised to the same
origin, rather than the later handler-dispatch time. Invalid/stale output timestamps
fall back to a current audio/performance mapping with `baseLatency + outputLatency`
estimated and explicitly treated as an estimate, not hardware calibration.

The original twelve beats,550ms spacing, three four-beat repetitions and syncopated
offbeats are unchanged. The first repetition remains listening-only. Tapping opens
at the second repetition; a350ms final grace accommodates the last delayed response.
It does not play a fourth repetition. Hidden pages, navigation or interrupted audio
cancel the attempt without grading. New attempts clear old taps, feedback and timers.

## Beginner assessment: consistency, not tap count or fixed phase

The pure `Pulse.assess` function fits **one tempo and one offset for the entire
attempt**. It first looks across a broad tempo range; only after choosing the
strongest consistent model does it decide whether that tempo follows the music.
This prevents slow steady taps being mistaken for a faster pulse with missing beats.

Provisional beginner criteria at the existing550ms beat:

- At least six distinct matched beat positions and at least75% of registered taps
  matched; one best tap per position. Repeated clicks cannot inflate the score.
- Fitted tempo within±15% of the music; variation within126.5ms of the fitted pulse.
  A constant device/reaction offset is allowed; each tap is not independently shifted.
- At least two matched taps in each final repetition and a span of five fitted
  intervals. At most two missing positions and at least three actual adjacent-input,
  one-beat links prevent sparse or mixed-tempo input being explained as a pulse.
- A slightly faster consistent pulse can naturally produce more than eight taps;
  it is not rejected just for that count. Double tempo, half tempo, clusters and
  uneven input remain unsuccessful.

These thresholds are a development hypothesis for beginner use, not teacher-validated
universal norms. Actual pupils and common school devices should inform later tuning.
No accounts, pupil identities, persistent tap records or telemetry are introduced.

## Feedback and progression

NN/NB/EN feedback distinguishes too few taps, tapping too fast, tapping too slowly,
uneven spacing and stopping before covering both final repetitions. It gives an
action to try, rather than only “Prøv igjen”. Success says the next activity is
unlocked, enables `Neste oppgåve` and the second task tab, and shows the normal✓.
Practising again after success does not erase an already earned unlock.

Pointerdown, non-repeating Space/Enter and assistive-technology click activation
are supported. Default duplicate clicks and held-key autorepeat are suppressed.
The existing cards, controls, typography and layout are preserved.

## Independent AI review and automated evidence

Two independent read-only AI reviews examined musical assessment and QA. Their
first pass found sparse-grid aliases and inconsistent treatment of natural500ms
versus650ms tapping. Negative regressions now reject both sparse/mixed examples,
while accepting ten steady500ms taps and rejecting steady650ms taps. Both bounded
second reviews passed these fixes. These reviews are **not human teacher evidence**.

`tests/pulse.cjs` exercises the actual pure module: steady,220/320ms delayed, jitter,
missed beats, one misplaced tap, irregularity, clusters, double/half tempo, slow
tapping, output-clock mapping, latency fallback and delayed event dispatch. Those
are deterministic **simulations**, not browser/device evidence.

`tests/seven-browser/pulse.spec.cjs` uses actual Chromium audio and keyboard/pointer
input, including touch `.tap()` in Android-tablet emulation. It checks native audio
scheduling, output-timestamp mapping, fallback, steady/delayed/jittered/irregular
attempts, all three feedback languages, failure→success, retained unlock, suspension,
held Space, navigation cancellation and visible Next navigation. Native scheduling
checks see all18 original oscillator starts: twelve pulse beats plus six offbeats.

Focused batch1:16PASS/6FAIL; failures were the three-language irregular-feedback
classification on both viewports. It correctly rejected that tapping but said
“too fast”. The repaired batch2: **22PASS**,0FAIL,0skips,0retries. Individual30second
timeouts remain unchanged. Full new-suite and default-gate results are recorded
separately after completion; focused passes do not approve a pupil release.

The committed `staff-preview/musikkverkstad.html` is refreshed from the corrected
build and checked byte-for-byte by the Node suite. The seven uploaded originals
remain checksum-identical. No release-gate decision, security policy or legacy
browser assertion is changed. Windows/Android hardware latency, audible alignment,
AT usability and beginner suitability remain **NOT TESTED/PENDING** for this change.

## Wider new-suite observation and held discrepancy

On code commit `ba1b0181b6629a8e5683c84249a65d5276ce4a95`, the full148case
new browser suite recorded **145PASS/3FAIL**,0skips,0retries,528.755seconds.
Two failures are unchanged managed `file://` policy blocks. The third is the tablet
fallback-clock case: eight taps registered, but the assessment returned false/fast.
Normal output-timestamp cases, delayed touch tapping, all feedback languages, retry
and visible-unlock cases passed. The previously focused22case suite passed in full.

The full-run failure trace is retained as `.quality/pulse-fallback-full-trace.zip`.
Its Space request gaps were294.763,551.264,550.866,653.720,552.793,551.124 and546.555ms,
so the driver's actual requests were not uniformly550ms. However, those wall-clock
intervals alone do not reproduce the failure in the pure scorer. Actual tap/audio
clock readings were not attached in that original run, so neither machine load nor
an application fallback defect can be established as the cause.

The unchanged fallback assertion was rerun independently in both configurations,
with trace retention and non-behavioural timing attachments: **2PASS**,
12.589seconds total. Desktop scored8/8 at550.937ms fitted period; tablet8/8 at549.549ms.
Both reported baseLatency10ms/outputLatency32ms. A read-only independent QA review
confirmed this evidence limitation. No application patch was made on speculation.
The test now attaches raw automated tap/clock diagnostics for any future occurrence;
individual bounds, assertions and zero retries are unchanged.

This discrepancy remains **unresolved**, not converted into PASS by the isolated
rerun. It is held for further clock/device evidence after the bounded repair passes.
The update addresses the verified fixed-phase rejection and passes the focused human-
scenario regressions; it is not an unconditional fallback/device validation claim.
