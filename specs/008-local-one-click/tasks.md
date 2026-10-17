# 008 — Delivery tasks
- [x] T-001 [FR-001..FR-006] Specify user-visible behavior, design, security and acceptance before implementation.
- [x] T-002 [FR-003,FR-004,FR-005] Author RED server and launcher contract tests first.
- [x] T-003 [FR-003,FR-004] Implement stdlib local HTTP server + health endpoint.
- [x] T-004 [FR-001,FR-002,FR-004] Implement macOS .command, Bash dependency/build/start/open/stop script.
- [x] T-005 [FR-005] Integrate deploy tests in npm/CI; verify against real generated dist.
- [x] T-006 [FR-006] Update README & developer notes including exact branch and missing Node flows.
- [x] T-007 [FR-005] Record green Actions run with tests; inspect failure-path behavior.
- [ ] T-008 [FR-001] Parent Mac Finder one-click smoke test after download (manual; pending).

## Convergence evidence (2026-10-17)
- Commit `0ddf97de0b271b2137538d1e9cb60661434fb9ff`, green Actions https://github.com/JohnsonGarden/3D/actions/runs/39033643766.
- 4 SDD spec packets, 39/39 pure simulation tests, **9/9** deployment tests, TypeScript/Vite production build, and unchanged 7/7 Chromium driving E2E all passed. Deployment suite adds standalone bootstrap reuse/occupied-folder handling and executable mode checks.
- A single-file zipped bootstrap is available for user download; its behavior has also been syntax-checked and tested with a stub project under a temporary path. Actual curl of live GitHub ZIP and macOS Finder/Gatekeeper on a Mac have not been run here.
- Issue #6: repo does not yet have a committed `package-lock.json`; launcher uses npm install until lockfile delivered. This is a documented reproducibility gap, not an implementation-blocking one-click obstacle.
- Remaining T-008 requires parent to run on MacBook Air M5 and report first-run result and Safari or Chrome WebGL rendering.
