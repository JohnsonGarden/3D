# 014 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Specify child journey, deterministic trigger and clear state policy.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004] Add failing Node and real browser acceptance tests.
- [x] T-003 [FR-001,FR-002] Implement immutable checkpoint data and pure segment progress.
- [x] T-004 [FR-001,FR-003] Show 3D gates and route strip, restart versus car-only reset.
- [x] T-005 [FR-004] Run entire SDD/unit/build/deploy/Chromium suite and record CI evidence.
- [ ] T-006 [FR-001,FR-003] Parent/child actual device driving, accessibility and FPS.

## Automated convergence — 2026-10-17
- GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39041168696
- Verified on the feature's code commit: 64 Node, 11 deploy, 19 Chromium, 10 SDD, production build passed. Earlier RED acceptance tests were written before their feature implementation; no skipped tests in the recorded green run.
- Real Mac Finder, Apple Silicon FPS/p95, iPhone/iPad Safari and parent-approved imported child GLBs remain **manual pending** where applicable; do not call these complete.
