# 013 — architecture and design

## Pieces
- Pure `src/sim/frame-metrics.ts`: bounded 300-sample rolling millisecond window, input range 1..250ms, deterministic 50th-percentile median and 95th-percentile nearest-rank interval. Return null until 30 valid samples.
- `src/world/World.tsx` R3F callback records raw frame deltas only if opted-in and visible, accumulates display time and emits the sample snapshot around once every >=1 second; leave existing fixed timestep clamping unchanged. Reset on toggle and garage open.
- `src/App.tsx`: small accessible toolbar toggle and performance status panel; no per-frame setState. Display limited precision, actual sample size, and caveat; optional manual screenshot/log for user.
- `src/style.css` ensures panel does not cover critical speed/controls in narrow screens.

## Tradeoffs
- RAF frame-time is accessible without a GPU extension; it does not isolate GPU vs CPU bottlenecks or prove hardware targets.
- Existing R3F render loop unchanged when diagnostics disabled; short opt-in overhead is trivial for 300 samples.
- Excluding background stalls and garage pause prevents uninterpretable p95 spikes.
- No external package or telemetry data path.

## Harness
SPECIFY → RED stat + real browser toggling tests → GREEN rolling quantiles and UI → CONVERGE entire CI → parent Mac M5 FPS/p95/manual environment log.
