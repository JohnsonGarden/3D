# 006 — Requirement traceability and verification

| Req | Automated test | Manual / status |
| --- | --- | --- |
| FR-001 | `truck-scale.test.ts`: measured cm to m, width reference, isotropic ratios | Confirm measurement points from physical car |
| FR-002 | `truck-scale.test.ts` + `vehicle.test.ts`: truck dimensions/wheelbase; Chromium scene | Validate high point/wheels visually; sampled mesh remains fabricated |
| FR-003 | `truck-scale.test.ts` imported bounds uniform scale/invalid dimensions | Import 3D faithful GLB; pending model creation |
| FR-004 | `first-drive.spec.ts` garage visible calibrated measurement labels | Parent approval that bumper excluded |
| FR-005 | GitHub Actions spec/unit/build/Chromium | Record actual run URL and evidence after green |

### Baseline (RED stage)
Existing code hardcodes passenger-car prototype (length 3.6 m, width 1.8 m), and imports GLB using longest dimension. These conflict with the measured physical-car contract; new tests must first reveal the missing calibration implementation.

### GREEN implementation
- Prototype now renders truck-sized cab, frame and wheels; geometry remains artistic placeholder.
- User GLBs scale only by X-axis bounding width and are checked for positive nondegenerate dimensions; parent must review roof/bumper/forward-axis alignment.
- Garage reveals all four calibrated physical dimensions, scale factor and bumper exclusion.

### Automated evidence — GREEN
At commit `a08b6467c9cd0241958470878a29160f8197c234`, https://github.com/JohnsonGarden/3D/actions/runs/39028274592 reports 22 Node tests passed, 4 Chromium tests passed, TypeScript/Vite build passed. Browser artifact contains a rendering screenshot. Parent/child playtest and actual GLB-to-photo geometry comparison are NOT complete.
