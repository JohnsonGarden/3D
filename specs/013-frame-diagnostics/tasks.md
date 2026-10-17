# 013 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Write performance observation spec with manual benchmark boundaries.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004] Add RED quantile/rolling tests and Chromium diagnostics test before implementation.
- [x] T-003 [FR-002] Implement pure bounded sample window, median and p95.
- [x] T-004 [FR-001,FR-003] Wire opt-in R3F frame sampler and limited React UI updates.
- [x] T-005 [FR-001,FR-004] UI and accurate readout caveats.
- [x] T-006 [FR-004] CI full SDD/Node/build/deploy/Chromium including 012 integration; record real results.
- [ ] T-007 [FR-003,FR-004] Manual M5 and iPhone reference-device FPS/p95 after warmup, along with OS/browser/GPU/viewport.

## Automated convergence — 2026-10-17
- GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39040665619
- Verified on the feature's code commit: 59 Node, 11 deploy, 18 Chromium, 9 SDD, production build passed. Earlier RED acceptance tests were written before their feature implementation; no skipped tests in the recorded green run.
- Real Mac Finder, Apple Silicon FPS/p95, iPhone/iPad Safari and parent-approved imported child GLBs remain **manual pending** where applicable; do not call these complete.
