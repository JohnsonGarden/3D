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

## Root/Homebrew installer regression (2026-10-17)
- [x] T-009 [FR-007] Add RED test for effective UID 0 refusal and ordinary UID acceptance; check both entry paths guard before brew, curl and installs.
- [x] T-010 [FR-007] Add shared project launcher guard and standalone self-contained root check with non-invasive repair guidance.
- [x] T-011 [FR-006,FR-007] Document regular-user recovery and old installer reuse caveat.
- [x] T-012 [FR-005,FR-007] Verify hotfix through GitHub Actions and record evidence; Mac Finder confirmation remains pending.

### Root/homebrew hotfix gate — GREEN
- GitHub Actions at `32938c213b7877fa4dca239c38a306c02d07433e`: https://github.com/JohnsonGarden/3D/actions/runs/39036181217
- Checks pass: 43 Node simulation/storage tests, **11** deployment tests (including pure simulated effective UID 0 reject & UID 501 accept, early guard placement in both launchers), 12 Chromium E2E, TS/Vite build, 5 SDD packets. Both CI jobs success.
- Manual Mac reproduction of original root error and successful Finder retry from non-root user still not completed; T-008 stays pending.
