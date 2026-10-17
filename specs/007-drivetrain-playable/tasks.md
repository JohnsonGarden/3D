# 007 — Tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004,FR-005,FR-006] Write accepted scope, architecture, trace, tests before implementation.
- [x] T-002 [FR-002,FR-003,FR-004] Add test-first pure drivetrain RED cases; baseline CI expected to fail until core exists.
- [x] T-003 [FR-002,FR-003,FR-004] Add pure drivetrain state/reducer, steering-angle config and bounded traction estimate.
- [x] T-004 [FR-004,FR-005] Extend kinematic fixed-step model without affecting existing API, preserve 8×4 default.
- [x] T-005 [FR-001] Render 14 physical sample tires; both front axles visibly steer, rear remains straight; rectify heading sign.
- [x] T-006 [FR-002,FR-003,FR-005] Implement accessible buttons and keyboard shortcuts, visible state and explanatory approximation notice.
- [x] T-007 [FR-006] Confirm Node tests/spec/typecheck/build + headless Chromium tests; inspect screenshot and record run.
- [ ] T-008 [FR-001,FR-004] Later parent/child usability & actual Mac FPS, actual traction/GLB rigging and geometry signoff.

## CI convergence — 2026-10-17
- Code commit `99d44c53bb0c9799ebb04f0152904f011d2fcdb5`, GitHub Actions https://github.com/JohnsonGarden/3D/actions/runs/39032367330: `39/39` Node unit tests, `7/7` actual Chromium WebGL/controls browser tests, SDD checker (3 feature packets) and TypeScript/Vite production build pass.
- Chromium `playable-browser-evidence` screenshot visually confirms exposed rear chassis rather than cargo box and the new right-side accessible transmission HUD.
- Parent v3 external silhouette remains accepted-for-progress; no claim of authentic photo shape, actual wheel torque/differential linkage or reference Mac FPS. T-008 remains open.
