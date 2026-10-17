# 006 — Architectural design

1. Create `src/sim/truck-scale.ts`: immutable measurements in centimeters, target in-world width in meters, pure guard/calibration functions; exported authoritative dimensions in meters.
2. Import derived dimensions in `vehicle.ts`, replacing the original generic 3.6 × 1.8 m passenger-car constants. Set truck-style wheelbase/steering dynamics; keep deterministic fixed timestep.
3. R3F placeholder: truck-like front cab and rear brick body; wheel radius, width/length and cab highest point are driven from contract, no hardcoded old car-size assumptions. Follow camera rises and moves back to see the longer truck.
4. GLB loader visual scaling computes width-specific uniform multiplier based on model X bounding dimension, never longest-dimension fitting. Zero-width meshes rejected. Note assumptions (axes/front bumper) to parent.
5. Garage UI shows measured toy input, multiplier and derived dimensions, with explicit length excluding front bumper.
6. Run pure scale + driving tests, spec guard, TS/Vite build, Chromium browser test and capture evidence. Stop short of claiming vehicle physics/visible photo fidelity.

### Design tradeoffs
- Width 2.50m is an intentional large rigid truck default, less than CA's general 102in (~2.6m) total-width cap, though some streets and conditions differ. **Not** a claim that this model is road-legal. Reference: https://dot.ca.gov/programs/traffic-operations/legal-truck-access/vehicle-widths
- A bounding-box-wide GLB may have mirrors/wheels and not exactly the physical 3.1cm body width; calibration is preliminary until geometry markers or manifest specify measurement landmarks.
- Wheel centers and bumper projection are unknown. The procedural truck's 5.4m wheelbase is a clearly labelled design placeholder, not an inference from the photos.
