# 010 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Specify exact-byte manual GLB export, safe naming, failures and origin/privacy policy.
- [x] T-002 [FR-001,FR-002,FR-003] Add RED Node and Chromium tests before implementation.
- [x] T-003 [FR-002,FR-003] Implement pure bytes/filename export adapter with GLB guard and 20MB limit.
- [x] T-004 [FR-001,FR-003] Add accessible per-entry export action with lifecycle cleanup and error feedback.
- [x] T-005 [FR-004] Explain backup limits and how to re-import exported models in README/UI.
- [x] T-006 [FR-001,FR-002,FR-003,FR-004] Check SDD, Node, deployment, build and Chromium; record real CI outcome.
- [ ] T-007 [FR-001,FR-003] Manual Safari and macOS Finder download verification (hardware-dependent).

## Automated convergence — 2026-10-17
- GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39038932964
- Verified on the feature's code commit: 46 Node, 11 deploy, 14 Chromium, 6 SDD, production build passed. Earlier RED acceptance tests were written before their feature implementation; no skipped tests in the recorded green run.
- Real Mac Finder, Apple Silicon FPS/p95, iPhone/iPad Safari and parent-approved imported child GLBs remain **manual pending** where applicable; do not call these complete.
