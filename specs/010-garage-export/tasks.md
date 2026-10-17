# 010 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Specify exact-byte manual GLB export, safe naming, failures and origin/privacy policy.
- [x] T-002 [FR-001,FR-002,FR-003] Add RED Node and Chromium tests before implementation.
- [x] T-003 [FR-002,FR-003] Implement pure bytes/filename export adapter with GLB guard and 20MB limit.
- [x] T-004 [FR-001,FR-003] Add accessible per-entry export action with lifecycle cleanup and error feedback.
- [x] T-005 [FR-004] Explain backup limits and how to re-import exported models in README/UI.
- [x] T-006 [FR-001,FR-002,FR-003,FR-004] Check SDD, Node, deployment, build and Chromium; record real CI outcome.
- [ ] T-007 [FR-001,FR-003] Manual Safari and macOS Finder download verification (hardware-dependent).

## Convergence — 2026-10-17
- RED tests committed before feature implementation. PR #7: https://github.com/JohnsonGarden/3D/pull/7
- GREEN: https://github.com/JohnsonGarden/3D/actions/runs/39038932964 at commit `e1a879bd4e47a7b028032cadbf1c394f0a9dd617`.
- SDD validator 6 packets; Node 46/46, deploy 11/11, Chromium 14/14, production TypeScript/Vite build success. E2E verifies exact downloaded GLB bytes, retained selection after reload, corrupt storage export failure.
- A prior browser run at `c1036fa` failed one existing notice-text assertion after copy update; restored the original notice phrase and reran full CI successfully. No test was skipped.
- Parent Safari and Finder download-path smoke remain open as T-007; never treat IndexedDB as durable backup.
