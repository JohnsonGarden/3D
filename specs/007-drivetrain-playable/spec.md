# 007 — Interactive 8×4 / 8×8 and double-front-axle steering (M1)

Status: implemented arcade drivetrain vertical slice; automated tests and Chromium screenshot green 2026-10-17. Real physics, child usability and imported-GLB wheel rigging remain open.

## Goal
A child can drive the four-axle brick tractor, see 14 tires and the first two axle sets steering, toggle 8×4/8×8, and independently engage 3 differential-lock *control states* without mistaking the browser toy for mechanical drivetrain simulation.

## Ground truth / non-goals
Parent-verified: axle 1 has 1 tire per side; axles 2–4 each 2 tires per side, **14 tires**. Axles 1 and 2 steer; 3 and 4 do not. Rear axles 3 and 4 always powered; front axles 1 and 2 selectable for 8×4 or 8×8. Three locks: front axle group, rear axle group, central. Physical length/axle locations derive from specs/006. External v3 silhouette already accepted *for progress*, not final appearance.

No differential gear solver, torque split, collision contacts, suspension, steering linkage, or guarantee of real-life traction. A **labelled simplified traction example** can compare 8×4 and 8×8 on a selectable low-grip surface without overclaiming actual physics.

## Requirements
### FR-001 Real wheel stations and steering geometry
Given the default procedural 3D vehicle, when it appears, then there are exactly 14 visible tire meshes distributed 2/4/4/4 longitudinally at measured axle centers. When left/right is held, wheel visual yaw is applied to **both** steerable front axle stations only; rear axle station yaw remains 0. Gameplay kinematic heading must follow control direction, never invert the mesh from simulation direction.

### FR-002 Mode change and drivetrain display
Given a parent-confirmed 8×4 default, when pressing Q or the drivetrain toggle button, then mode switches to 8×8 and back, HUD reflects which axle stations are powered, and existing controls W/A/S/D/Space/R/G remain functional. No network requests or reload required.

### FR-003 Three independent diff locks
Given all 3 locks initially disengaged, when pressing 1, 2 or 3 (or corresponding accessible buttons) then only front, rear or central lock flips its logical state; all combinations work without resetting the truck. HUD uses aria-pressed for each state; label is unambiguous. Not actual diff gear forces.

### FR-004 Demonstrable low-grip state, bounded determinism
Given paved surface default, when switching between 8×4 and 8×8, then dry-ground acceleration/steering remains the same; an AWD 'magic speed boost' on dry pavement is forbidden. Given optional loose-grip demonstration toggled with T, powered axle count/lock engagement may change a **bounded traction coefficient** and thereby simulated acceleration. Deterministic pure numerical tests verify gains, clamping, and backward compatibility. Make the pedagogical approximation explicit in UI.

### FR-005 Stable session interactions
Given a driving session, when toggling Q/T/1/2/3, then controls update without refreshing and without interfering with typing or the garage dialog. When using Reset R, vehicle position/speed reset but manually selected drivetrain settings remain. Expose keybindings in UI.

### FR-006 Verified delivery
Given source changes, when CI runs, then spec trace, numerical unit tests, typecheck/build and actual Chromium 3D button/keyboard tests must succeed. Capture screenshot; measure real-device FPS later.

## Acceptance / deferred
Tests: `drivetrain.test.ts`, `vehicle.test.ts`, Playwright E2E. CI screenshot must show controls and the truck. Actual imported GLB tires are not automatically rigged by this feature. Low-grip selection is a *simulation test condition*, not yet a textured sand track or tire-force solver.
