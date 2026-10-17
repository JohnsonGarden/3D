# 006 — Scale the child's brick truck to realistic road-truck proportions

Status: parent measurements accepted (2026-10-17); four-axle procedural implementation and tests green in GitHub Actions, while authentic photo reconstruction, axle steering and real-device performance remain pending.

## Story
As a child, I want my actual 10.4 cm long, 3.1 cm wide brick truck to become a giant drivable 3D truck, so that it looks the same and drives on roads/buildings sized like the real world.

## Visual baseline approval status (2026-10-17)
Parent reviewed the v3 side-profile HTML and accepted **overall external dimensions and low-slung stance for continued development**. Cab/body shapes and LEGO part-level identity are explicitly **not final**; further silhouette micro-iterations are deferred rather than blocking development. ADR: [0002](../../docs/adr/0002-profile-baseline.md).

## Source-of-truth measurements
- Body length excluding front bumper: 10.4 cm.
- Maximum body width: 3.1 cm.
- Highest front-cab point: 4.7 cm.
- Tire outside diameter: 1.4 cm.
- Front bumper maximum forward protrusion beyond body front: **0.8 cm**, now measured. This adds **0.645161 m** to the game truck front. Total longitudinal envelope = **11.2 cm toy / 9.032258 m game** when no rear protrusion exists (rear-end outer details remain to be reviewed).
- Default drivable **body width**: 2.50 m (design calibration, not legally mandated 'standard').
- Single derived scale = 2.50 / 0.031 = 80.64516129032258; **NO nonuniform scaling**.
- Derived body length = 8.387096774 m; highest front point = 3.790322581 m; tire diameter = 1.129032258 m.
- Four axle centers, measured from **body front without bumper**: first 2.4 cm, then spacings 3.2 cm, 1.6 cm, 1.6 cm. Fourth axle to rear end 1.6 cm.
- Closure: 2.4 + 3.2 + 1.6 + 1.6 + 1.6 = **10.4 cm** exact.
- Axle longitudinal positions from body front: 2.4, 5.6, 7.2, 8.8 cm → **1.9355, 4.5161, 5.8065, 7.0968 m**.
- First-to-fourth axle span: 6.4 cm toy → **5.1613 m** game.
- Assumption: distances refer to axle **center lines**; unmeasured tire lateral offset, steering axles, wheel count per axle, wheel contact patches and front bumper height are visual/physics TODOs.
- Road lane nominal = 3.5 m. A width of 2.50 m leaves 0.50 m per side only when exactly centered in the lane.
- Geometry units: meter (Y up; front is -Z). Parents may revise measurements in future versions with a dated calibration entry.

## Additional measured profile and drivetrain reference (target specification; not yet runtime implementation)
- **Ground clearance beneath chassis: 0.3cm**, replacing outdated 0.6cm. World reference 0.24194m.
- Cabin length: **4.8cm** without front bumper; game 3.87097m. No cargo container or trailer.
- Tire top to square wheel arch opening: **0.1cm** (0.08065m in game); square arch opening longitudinal width **1.6cm** (1.29032m). The earlier 1.5cm wheel-arch measurement was ambiguous; v3 interpreted it as wheel-arch top 1.5cm above ground. Review at authentic mesh stage, do not assign extra geometry certainty.
- Rear curved roof fairing: 1.6cm long, 0.6cm high, with a central flat roof and a front downward fairing. v3 HTML's three 1.6cm longitudinal segments are a **working geometric interpretation**, not final parent-approved surfaces.
- **Tires: 14 physical tires total:** axle 1 single per side = 2, axles 2/3/4 dual per side = 4 each.
- **Front two axles steer**; rear two axles do not.
- Drive modes: **8×4** means axles 3–4 powered, **8×8** means axles 1–4 powered. Switching the front two axle drive engagement is supported in design, not yet simulated.
- Three toggled diff locks: **front axle group, rear axle group, central**. Control semantics confirmed; independent tire traction and differential equations are future work.
- This supplemental contract is encoded in `src/sim/approved-profile.ts`; real R3F mesh/physics will be changed in a later feature packet. Do not confuse config with runtime capability.

## Functional requirements
### FR-001 Scale only from observed width
Given source physical dimensions and the desired in-world body width of 2.50 m, when dimensions are calibrated, then the same uniform scale factor applies to all measured linear dimensions with no X/Y/Z distortion.

### FR-002 Apply to procedural prototype and physics model
Given the prototype truck, when the game loads, then vehicle length 8.387... m, width 2.50 m, highest point 3.790... m, wheels 1.129... m diameter, and the four wheels-per-side axle locations use measured longitudinal coordinates and steering camera parameters belong to a road-truck silhouette. Current handling is a simplified bicycle approximation anchored to first-to-fourth axle span. Prototype remains labelled a fictional sample rather than a faithful HEIC reconstruction.

### FR-003 Model import calibrated by measured vehicle width
Given an imported GLB, when local geometry is parsed, then it is **uniformly** scaled to width 2.50 m, centered and stood on the ground. The importer assumes positive X width / positive Y height / Z length and provides notice that axis/bumper/measurement accuracy must be reviewed. Reject zero/invalid width, never stretch to meet all dimensions, and never silently 'fix' aspect ratios.

### FR-004 User sees calibrated dimensions and measurement provenance
Given garage panel, when parent opens it, then the 2.50 m width, 8.39 m body length, 3.79 m highest point and 1.13 m tire are visible as physical calibration (not a claim of fully measured rear bumper/total length). Show 80.65× and 'excluding front bumper'.

### FR-006 Four axle locations and front bumper envelope
Given the child-measured axle centers and front bumper, when a truck is rendered, the example has exactly four distinct longitudinal axle stations on each side, first-to-last span 5.16m, accurate local body-frame positions, and a front bumper with 0.65m forward projection. All physical dimensions come from ONE uniform scale. The total front-to-rear reference envelope is 9.03m, subject to unmeasured rear appendages. Validate axle offsets sum to body length; no fake measured suspension/steering mechanisms.

### FR-005 Scale is regression-tested
Given CI, when calibration or vehicle behavior changes, then pure tests verify the uniform multiplier, measured ratios, actual lane clearance, finite geometry guards and changed wheelbase; Playwright checks calibration text. Maintain snapshot evidence where possible.

## Out of scope
Actual photo-derived mesh, verified tire lateral offsets and steering-axle selection, simulated mass/tire friction/suspension, street-legal certification, guaranteed truck clearance under bridges, roof shape mapping to supplied photos.

## Acceptance
Given physical input measurements, when executing the scale tests and opening garage, then numeric values and attribution match exactly (display rounded to two decimals). No independent axis multipliers. Programmatically generated truck mesh is inspected in browser at truck proportions, but this is not proof of likeness to photos.
