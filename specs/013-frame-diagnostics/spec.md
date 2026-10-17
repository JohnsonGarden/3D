# 013 — Real browser frame-time diagnostics

Status: specified; user Mac/iPhone verification pending.

## Story
As a parent/developer, I can turn on an unobtrusive in-session performance readout while driving the 3D world, so our 60FPS and 33ms p95 targets become measurable rather than guessed.

## Scope & safety
- Show actual `requestAnimationFrame` / R3F frame timing sampled from the displayed 3D scene. Never fabricate benchmark results, GPU usage, hardware identity, or performance numbers.
- Median FPS and p95 frame interval are observational browser metrics, **not GPU render time** or proof of cross-device performance. Sample only active, visible driving; exclude background-tab gaps >250ms and invalid deltas.
- Bounded rolling samples (<=300); no persistent storage, download, analytics, network upload, permissions or frame-by-frame React UI writes.
- User explicitly opens/closes diagnostics, with clear sampling status, sample count, and explanation; keep world/keyboard/touch/garage accessible.
- None of the six HEICs or measured vehicle geometry may change.

## Requirements
### FR-001 Live opt-in diagnostics
Given the real WebGL world, when I click 显示性能诊断, then the diagnostic panel displays sampling status and, after enough valid frames, median FPS and p95 frame interval in milliseconds with a sample count. Hide on click. Do not claim speed without samples.

### FR-002 Robust bounded statistics
Given any finite series of frame intervals, when samples are recorded, then negative/zero/NaN/Infinity or >250ms background gaps do not pollute metrics, memory is bounded to 300, and median and p95 are deterministic. Count 30 valid samples before publication.

### FR-003 No uncontrolled React churn
Given diagnostics disabled, the world performs no diagnostic-driven React state updates; given enabled, the display updates at most about once per second instead of every animation frame. Paused/garage/background tab frames are not used as active driving benchmark.

### FR-004 Compatibility and evidence
Given Chromium browser E2E plus Node tests, when the panel toggles, it shows actual samples without changing driving, collisions, garage, export, or touch controls. Device-specific FPS targets remain manual QA — recording target/reference device is necessary.

## Non-goals
WebGL GPU timer queries, battery data, machine telemetry, persistent logs, synthetic benchmarking, video capture, remote metrics dashboards, automatic quality scaling or proving a reference Mac reaches 60FPS.
