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
