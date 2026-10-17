# Acceptance traceability and evidence — 001

| Requirement | Automated proof | Manual proof / limitations |
| --- | --- | --- |
| FR-001 | Playwright: page heading, controls and canvas/error fallback | Chrome/Safari rendered screenshot & time-to-first-drive |
| FR-002 | node:test vehicle speed/steer/brake/reset/bad dt; Playwright keyboard path | Steering responsiveness and feel |
| FR-003 | Code scale constants; numerical finite tests | Measure model ratios, lane/vehicle, chase camera |
| FR-004 | Playwright Garage open/close; state pauses in scene | Child intuitiveness |
| FR-005 | File guards, local GLB import flow exposed | Load verified sample GLB; correct axes and visual fidelity not automated |
| FR-006 | Playwright audio file picker and media controls | Browser sound playback/manual pause, no autoplay |
| FR-007 | Playwright Reset/G and keyboard instructions | Keyboard focus / recovery |
| FR-008 | check:spec, npm test, npm run build, Playwright in CI | CI green and PR gate configuration |
| NFR-001 | Not yet automatable reliably across GPUs | FPS/p95 frame time on reference machine; record viewport |
| NFR-002 | node:test fixed-step and bounds | DevTools runtime frame spikes |
| NFR-003 | No API/backend in code; file chooser patterns | Check DevTools network; never transmit file |
| NFR-004 | Documents + review checklist | Check actual imported asset's third-party licenses |
| NFR-005 | DOM smoke test | Full 3D scene visual regression future |

## Convergence ledger (2026-10-17)
- Authored: feature docs, scene source, pure deterministic tests, browser smoke tests and workflow.
- Executed in this environment: Node-only tests/spec validator are candidates; require recorded command output.
- Pending: npm dependency install, compiled application, real Chromium rendered scene, GLB visual validation, performance benchmark, child usability.
- Do not mark fully converged until the above green evidence is attached to a PR.
