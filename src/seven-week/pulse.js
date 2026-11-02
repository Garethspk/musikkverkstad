/* One pulse/one fitted offset per attempt. No storage, telemetry or pupil identity. */
const Pulse = (() => {
  const median = values => {
    const a = values.slice().sort((x, y) => x - y), i = Math.floor(a.length / 2);
    return a.length % 2 ? a[i] : (a[i - 1] + a[i]) / 2;
  };
  const tailMs = 350;

  // Audio output timestamps map the audible audio frame to the performance clock.
  // The fallback estimates output latency; it is not hardware calibration.
  function timeline({performanceTime, contextTime, outputTimestamp, baseLatency = 0, outputLatency = 0}) {
    const t = outputTimestamp;
    if (t && Number.isFinite(t.contextTime) && t.contextTime >= 0 &&
        Number.isFinite(t.performanceTime) && t.performanceTime > 0 &&
        t.performanceTime <= performanceTime + 100 && t.performanceTime >= performanceTime - 1000 &&
        t.contextTime <= contextTime + .1 && contextTime - t.contextTime <= 1) {
      return {performanceTime: t.performanceTime, contextTime: t.contextTime, source: 'output-timestamp'};
    }
    const latency = [baseLatency, outputLatency].reduce((sum, v) =>
      sum + (Number.isFinite(v) && v > 0 ? v : 0), 0);
    return {performanceTime, contextTime: contextTime - latency, source: 'latency-estimate'};
  }

  function eventTime(value, now, timeOrigin) {
    if (!Number.isFinite(value) || value <= 0) return now;
    const normal = value > 1e12 ? value - timeOrigin : value;
    return Number.isFinite(normal) && normal <= now + 100 ? normal : now;
  }

  function assess(timestamps, beatMs = 550) {
    const taps = timestamps.filter(t => Number.isFinite(t) && t >= 4 * beatMs &&
      t < 12 * beatMs + tailMs).slice().sort((a, b) => a - b);
    const fail = reason => ({ok: false, reason, taps: taps.length, matched: 0});
    if (taps.length > 24) return fail('fast');
    if (taps.length < 6) return fail('few');
    const tolerance = Math.min(140, beatMs * .23);
    const minPeriod = beatMs * .85, maxPeriod = beatMs * 1.15;
    const periods = new Set([beatMs]);
    // Pair distances permit a missed beat and avoid mistaking alternating jitter
    // for a faster tempo. Each candidate is a SINGLE tempo for the entire attempt.
    for (let a = 0; a < taps.length; a++) for (let b = a + 1; b < taps.length; b++) {
      for (let beats = 1; beats <= 8; beats++) {
        const period = (taps[b] - taps[a]) / beats;
        // Fit the strongest whole-attempt model BEFORE judging tempo. Otherwise
        // slow steady tapping can alias onto an in-range grid with dropped taps.
        if (period >= beatMs * .45 && period <= beatMs * 2.1) periods.add(period);
      }
    }
    let best = null;
    function select(period, phase) {
      const unique = new Map();
      taps.forEach((time, index) => {
        const beat = Math.round((time - phase) / period);
        const error = time - (phase + beat * period);
        if (Math.abs(error) > tolerance) return;
        const previous = unique.get(beat);
        if (!previous || Math.abs(error) < Math.abs(previous.error)) unique.set(beat, {time, beat, error, index});
      });
      return [...unique.values()].sort((a, b) => a.beat - b.beat);
    }
    for (const period of periods) for (const anchor of taps) {
      const residuals = taps.map(t => t - anchor - Math.round((t - anchor) / period) * period);
      let phase = anchor + median(residuals), fitted = period;
      let matches = select(fitted, phase);
      if (matches.length < 6) continue;
      // Refit the actual tempo instead of allowing the tolerance band to hide
      // a consistently too-fast/slow pulse at the edge of the permitted range.
      const meanBeat = matches.reduce((s, t) => s + t.beat, 0) / matches.length;
      const meanTime = matches.reduce((s, t) => s + t.time, 0) / matches.length;
      const variance = matches.reduce((s, t) => s + (t.beat - meanBeat) ** 2, 0);
      if (!variance) continue;
      fitted = matches.reduce((s, t) => s + (t.beat - meanBeat) * (t.time - meanTime), 0) / variance;
      if (fitted < beatMs * .45 || fitted > beatMs * 2.1) continue;
      phase = meanTime - fitted * meanBeat;
      matches = select(fitted, phase);
      const span = matches.length ? matches.at(-1).beat - matches[0].beat : 0;
      const firstRepeat = matches.filter(t => t.time < 8 * beatMs).length;
      const lastRepeat = matches.filter(t => t.time >= 8 * beatMs).length;
      const missed = span + 1 - matches.length;
      const steadyLinks = matches.slice(1).filter((t, i) => t.index === matches[i].index + 1 &&
        t.beat === matches[i].beat + 1 && Math.abs(t.time - matches[i].time - fitted) <= 2 * tolerance).length;
      if (matches.length < 6 || matches.length / taps.length < .75 || span < 5 || missed > 2 || steadyLinks < 3 ||
          firstRepeat < 2 || lastRepeat < 2) continue;
      const variationMs = Math.sqrt(matches.reduce((s, t) => s + t.error ** 2, 0) / matches.length);
      if (!best || matches.length > best.matched || matches.length === best.matched && variationMs < best.variationMs) {
        best = {ok: true, reason: 'steady', taps: taps.length, matched: matches.length,
          periodMs: fitted, variationMs, phaseMs: phase};
      }
    }
    if (best) {
      if (best.periodMs < minPeriod) return fail('fast');
      if (best.periodMs > maxPeriod) return fail('slow');
      return best;
    }
    const gaps = taps.slice(1).map((time, i) => time - taps[i]);
    const interval = median(gaps);
    if (Math.max(...gaps) - Math.min(...gaps) > beatMs * .6) return fail('uneven');
    if (interval < minPeriod) return fail('fast');
    if (interval > maxPeriod) return fail('slow');
    if (taps.at(-1) - taps[0] < 4.5 * beatMs || taps.filter(t => t < 8 * beatMs).length < 2 ||
        taps.filter(t => t >= 8 * beatMs).length < 2) return fail('coverage');
    return fail('uneven');
  }
  return Object.freeze({assess, timeline, eventTime, tailMs});
})();
