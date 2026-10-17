# 015 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Specify pinned separate Mac preview install and origin limitations.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004] Author RED deployment tests before editing bootstrap.
- [x] T-003 [FR-001,FR-002,FR-003] Update existing executable bootstrap source, isolated home and port, preserve root guard.
- [x] T-004 [FR-003] Add visible warning and Mac preview README.
- [x] T-005 [FR-004] Run SDD, unit, deploy, build, Chromium complete CI, record evidence.
- [ ] T-006 [FR-002,FR-003,FR-004] Manually validate non-root Mac Finder launch, Gatekeeper prompt and first real download.

## Automated convergence — 2026-10-17
- GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39041596051
- Verified: 11 SDD packets; 64/64 Node tests, 14/14 deployment tests (including new hermetic preview reuse/port/pin and original root safety checks), 19/19 Chromium E2E tests; TypeScript/Vite production build successful.
- Pinned preview archive is a selected feature **branch**, not an immutable commit or automatic update; future edits to it must be reviewed.
- Manual T-006 pending: Finder double-click executable permissions, Gatekeeper prompt, real GitHub ZIP download, non-root on user Mac, Chrome/Safari origin/isolation, FPS and family demo.
