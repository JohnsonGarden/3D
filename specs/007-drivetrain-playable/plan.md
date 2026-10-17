# 007 — Design and architecture

- Pure `src/sim/drivetrain.ts` owns initial mode (8×4), three independent toggled locks, paved/loose demo surface, traction coefficient, front two steering-angle distribution. No React or Three.js imports. Confirmed physical axle roles are from `approved-profile.ts`.
- Maintain fixed-step deterministic `advanceVehicle`; accept optional drivetrain state with original calls backward-compatible. Dry pavement equal response in 8×4 vs 8×8. Loose grip reduces acceleration in 8×4, while 8×8 can increase available grip; locks improve it in bounded, *illustrative* amounts.
- R3F sample wheel groups: 14 independent tire meshes at four measured axle stations, 1/2/2/2 tires per side. Animate wheel-group yaw via refs inside useFrame. This is not actual rigid body steering or GLB rigging. Also correct mesh yaw sign vs simulator's +X-right convention.
- React HUD: Q switch mode, keys 1/2/3 independently toggle front/rear/center, T toggles slippery-surface demonstration; accessible pressed states; live powered axle count + explanatory non-physics note.
- CI E2E clicks/keyboard/garage/reset and visual screenshot; unit tests assert independent locks, exact per-axle roles and invariants.

## Decisions
Keep no added dependencies; do not pull Rapier until collision problem demands it. Persistent garage and per-wheel torque are separate packets. No 'all wheel drive' claim on an unrigged imported GLB. Child-facing defaults stay easy: W to go, G for garage, Q for drive.
