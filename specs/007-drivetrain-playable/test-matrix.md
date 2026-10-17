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
