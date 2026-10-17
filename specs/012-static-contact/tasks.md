# 012 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004,FR-005] Write SDD, limits and acceptance scenarios.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004,FR-005] Author failing Node collision and real Chromium acceptance tests before implementation.
- [x] T-003 [FR-001] Share original city footprint data between scene and simulation; add visible kiosk as steerable target.
- [x] T-004 [FR-002,FR-003] Add rotated rectangle SAT and fixed-step swept static contact solver (no new physics package).
- [x] T-005 [FR-003,FR-004] Wire collision in existing fixed loop and UI feedback, no per-frame React setState.
- [x] T-006 [FR-005] Run entire spec/unit/deploy/build/Chromium suite, inspect evidence, log CI run.
- [ ] T-007 [FR-003,FR-005] Manual Mac/iPhone collision, camera, imported real GLB, comfort and FPS validation.

## Automated convergence — 2026-10-17
- GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39040148518
- Verified on the feature's code commit: 55 Node, 11 deploy, 17 Chromium, 8 SDD, production build passed. Earlier RED acceptance tests were written before their feature implementation; no skipped tests in the recorded green run.
- Real Mac Finder, Apple Silicon FPS/p95, iPhone/iPad Safari and parent-approved imported child GLBs remain **manual pending** where applicable; do not call these complete.
