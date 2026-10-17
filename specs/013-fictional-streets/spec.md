# 013 — Fictional city intersections, first explorable street network

Status: proposed 2026-10-17, automated convergence pending. This is **not** Los Angeles GIS data or a streamed infinite map.

## User story
As a child driving the family's LEGO truck, I can follow the original two-lane street and find recognizable left and right turn opportunities at three cross intersections without needing to restart the scene.

## Coordinate and data boundaries
- Right-handed Three.js world: Y up, vehicle faces -Z at zero heading; every unit = 1 meter.
- Two travel lanes, each 3.5 meters, yielding **7.0 meters** total road width. Driveable pavement is flat and currently non-colliding, without rigid-body suspension/kerb collision.
- **Fictional seed-derived** streets, buildings, sidewalk and road markers. No Google/OSM/GIS/LA-specific data or imagery, no additional external assets or network calls.
- Preserve approved truck geometry and drivetrain modes, fixed-step vehicle physics, local garage and touch control.

## Requirements
### FR-001 Three traversable intersections
Given the initial straight street, when traveling north (-Z), then three horizontal roads cross at documented world Z stations -100/-260/-420m, each 7m wide and 240m end-to-end. A driver may steer left/right onto flat pavement. Main road keeps its existing 7m width, at least the existing 760m nominal run.

### FR-002 Layout safety and clear sightlines
Given any generated building, when near any road/intersection, then its 9m×12m footprint has non-overlapping clearance from central and cross carriageways. Pavement markings must not cross the intersection center, and sidewalks must leave clear openings at junctions. No obstructing buildings in the driveable roadway.

### FR-003 Repeatable bounded draw budget
Given identical constants, then resulting intersections, building lots and lane dashes are deterministic. Use one InstancedMesh for buildings and one for all dashed lane marks, rather than creating a material and GPU draw call for each block/stripe. Keep scene bounded; no claim of infinite streaming or proven FPS.

### FR-004 Player-facing and regression acceptance
Given desktop/mobile WebGL, when the game opens, then the label honestly announces three fictional junctions, and keyboard / garage / GLB export / touch driving behavior keeps working. Automated unit and Chromium regression verifies scenarios; visual inspection / parent real-device performance are distinct manual gates.

## Explicit non-goals
Accurate LA street map, traffic AI, collision enforcement, traffic lights, origin shifts for infinite worlds, GPS navigation, full terrain streaming, suspension, per-wheel contacts or any benchmark without observed measurements.
