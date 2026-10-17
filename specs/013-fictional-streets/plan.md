# 013 — design plan

## Architecture
- Add deterministic pure `src/world/street-layout.ts` with street segments, markings, buildings and sidewalk spans. Three authored cross-road Z stations create a simple main corridor with three four-way junctions and six driveable east/west stubs.
- Shared 3.5m lane contract from `TRUCK_DIMENSIONS.laneWidthM`; a 7m paved width is strictly double that value.
- Test geometry footprint by bounding intervals so buildings, centerline markings and sidewalks leave usable junction corridors, while preserving the existing highway-style main road.
- In `World.tsx` replace hardcoded 40 independent building meshes and 105 individual dash meshes with **two instanced meshes** initialized in a React effect, not per frame. Reuse simple static road plane/curb meshes for intersections. No network textures, no package installs and no per-frame React state.
- Expose a factual UI label and one Playwright Chromium smoke/screenshot.

## Deferred design decisions
Large-scale chunk streaming with camera/user position, traffic lights, landmarks, license manifests for outside GIS, Rapier collision and frame-time audit are separate increments. This 013 cut is a bounded finite demonstrator, not a claim of completed open world.

## SDD/TDD
SPECIFY → write Node geometric acceptance + WebGL-visible UI browser test → RED → implement layout and render → GREEN complete CI, inspect screenshot → leave visual/M5 performance gate open.
