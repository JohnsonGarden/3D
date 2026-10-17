# 006 — Scale the child's brick truck to realistic road-truck proportions

Status: accepted after parent-provided physical measurements (2026-10-17); implementation pending CI confirmation.

## Story
As a child, I want my actual 10.4 cm long, 3.1 cm wide brick truck to become a giant drivable 3D truck, so that it looks the same and drives on roads/buildings sized like the real world.

## Source-of-truth measurements
- Body length excluding front bumper: 10.4 cm.
- Maximum body width: 3.1 cm.
- Highest front-cab point: 4.7 cm.
- Tire outside diameter: 1.4 cm.
- Front bumper projection: **not measured**; cannot be estimated or added to collision length as if measured.
- Default drivable **body width**: 2.50 m (design calibration, not legally mandated 'standard').
- Single derived scale = 2.50 / 0.031 = 80.64516129032258; **NO nonuniform scaling**.
- Derived body length = 8.387096774 m; highest front point = 3.790322581 m; tire diameter = 1.129032258 m.
- Road lane nominal = 3.5 m. A width of 2.50 m leaves 0.50 m per side only when exactly centered in the lane.
- Geometry units: meter (Y up; front is -Z). Parents may revise measurements in future versions with a dated calibration entry.

## Functional requirements
### FR-001 Scale only from observed width
Given source physical dimensions and the desired in-world body width of 2.50 m, when dimensions are calibrated, then the same uniform scale factor applies to all measured linear dimensions with no X/Y/Z distortion.

### FR-002 Apply to procedural prototype and physics model
Given the prototype truck, when the game loads, then vehicle length 8.387... m, width 2.50 m, highest point 3.790... m, wheels 1.129... m diameter, and wheelbase/steering camera parameters belong to a road-truck silhouette. Prototype remains labelled a fictional sample rather than a faithful HEIC reconstruction.

### FR-003 Model import calibrated by measured vehicle width
Given an imported GLB, when local geometry is parsed, then it is **uniformly** scaled to width 2.50 m, centered and stood on the ground. The importer assumes positive X width / positive Y height / Z length and provides notice that axis/bumper/measurement accuracy must be reviewed. Reject zero/invalid width, never stretch to meet all dimensions, and never silently 'fix' aspect ratios.

### FR-004 User sees calibrated dimensions and measurement provenance
Given garage panel, when parent opens it, then the 2.50 m width, 8.39 m body length, 3.79 m highest point and 1.13 m tire are visible as physical calibration (not a claim of fully measured rear bumper/total length). Show 80.65× and 'excluding front bumper'.

### FR-005 Scale is regression-tested
Given CI, when calibration or vehicle behavior changes, then pure tests verify the uniform multiplier, measured ratios, actual lane clearance, finite geometry guards and changed wheelbase; Playwright checks calibration text. Maintain snapshot evidence where possible.

## Out of scope
Actual photo-derived mesh, validated bumper projection, verified wheel axle positions, simulated mass/tire friction/suspension, street-legal certification, guaranteed truck clearance under bridges, roof shape mapping to supplied photos.

## Acceptance
Given physical input measurements, when executing the scale tests and opening garage, then numeric values and attribution match exactly (display rounded to two decimals). No independent axis multipliers. Programmatically generated truck mesh is inspected in browser at truck proportions, but this is not proof of likeness to photos.
