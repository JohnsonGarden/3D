# 007 — Acceptance traceability

| ID | Automatic check | Manual/open gate |
| --- | --- | --- |
| FR-001 | `drivetrain.test.ts` verifies 14 tires and steerable axle roles; Playwright confirms canvas | Observe first two wheel stations steer, trailing stations fixed in Chromium; imported GLB rigging pending |
| FR-002 | `drivetrain.test.ts` 8×4/8×8 output; Playwright Q+button and axle text | Child understands difference |
| FR-003 | `drivetrain.test.ts` independent 3 toggles; Playwright buttons + key shortcuts and aria-pressed | Differential gear transfer still absent |
| FR-004 | `drivetrain.test.ts` dry equality/low grip bounds; `vehicle.test.ts` pure forward stepping on both surfaces | Loose terrain as visual track, physical tire force solver pending |
| FR-005 | Playwright garage pause, reset, music picker and new panel checks | Keyboard non-interference during file dialog |
| FR-006 | `npm run ci` and Chromium Github Actions | CI evidence URL and screenshot artifact; real Mac FPS later |

RED before runtime code: `src/sim/drivetrain.test.ts` intentionally requires a missing module. A failing run is useful only until the implementation is committed; not a release state.

## Convergence evidence — 2026-10-17
Commit `99d44c53bb0c9799ebb04f0152904f011d2fcdb5` CI https://github.com/JohnsonGarden/3D/actions/runs/39032367330: 39 unit tests, 7 Chromium E2E tests, spec validator and production typecheck/build all green. Browser screenshot artifact `playable-browser-evidence` includes a visibly open-chassis tractor with new drivetrain control panel. User-uploaded GLB geometry is not rigged by these controls and imported-assets tests are separate. Steering yaw reversal was corrected to align Three.js -Z-forward mesh direction with simulator +X-right steering.
