# 014 — plan

## Architecture
- `src/game/checkpoints.ts` defines frozen static fictional route markers (x=1.75m, z=-42/-105/-190m, radius 3m) and pure segment-to-point distance logic.
- World paints three torus gate meshes derived from the very same checkpoint data, avoiding mismatch between graphics and goal triggers.
- Fixed-step world loop compares previous and contact-resolved positions, increments its progress ref only on successful crossings. Callback updates React progress **per gate**, not each RAF.
- App exposes a persistent compact journey strip (0/3, next objective, restart). R resets only car, dedicated restart increments journey reset count and clears progress.
- No external imagery, map providers, new dependencies, cookies, or child profile storage.

## Tradeoffs
- Three gates are fixed to one playable fictional lane; the next world-streaming phase will need a road graph and varying routes.
- Radius-based trigger ignores height and mesh geometry; contact uses separate measured truck footprint. No physics changes.
- Advance using an entire segment to avoid a high-speed frame jumping over a marker.

## Harness
SPEC → RED pure tests + browser first-gate test → GREEN in fixed sim → CI all suites / viewport verification → parent/child manual drive review.
