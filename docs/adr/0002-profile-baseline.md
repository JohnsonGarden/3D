# ADR-0002: Accept v3 external silhouette as non-blocking development baseline

- **Date:** 2026-10-17
- **Decision:** Parent accepts current HTML side-profile v3 **external dimensions and overall low-slung stance** for project progress. Detail likeness is not accepted or frozen. Do not require a polished photo-matched cab/fairing/LEGO mesh to proceed with driving, world or garage infrastructure.
- **Scope:** This is a calibration milestone, **not** an authentic CAD/GLB deliverable, visual identity sign-off, production-physics validation, or endorsement of guessed cab surfaces.
- **Assets:** Keep original `IMG_0719.HEIC` ... `IMG_0724.HEIC` unchanged. v3 HTML is a human-referenced calibration sketch. The sketch is not added to GitHub here because the current repository has not received that file.
- **Meters:** Real-world calibration remains `2.50m / 3.1cm = 80.645161x`; width, length, wheel diameter and measured four axle longitudinal positions are locked as **reference dimensions**. Rear appendages, if any, require separate measurement.
- **Corrections since initial spec:** chassis lowest-point ground clearance is **0.3cm**, explicitly replacing prior 0.6cm. Wheel top-to-arch opening is **0.1cm**, square arch 1.6cm, cabin length 4.8cm without front bumper. Front bumper projection remains 0.8cm. Roof rear fairing specified as 1.6cm long/0.6cm high; *exact roof curve and the v3 diagram's 1.6+1.6+1.6 decomposition remain interpretation rather than settled CAD geometry*.
- **Body:** No cargo container or trailer. It's a tractor/head with chassis and exposed rear region, not an extended rectangular cargo box.
- **Axles:** Four centers with 2.4/3.2/1.6/1.6/1.6cm front-to-rear closure. Tire count: **14** (A1 single each side; A2/A3/A4 dual each side). A1/A2 steer; A3/A4 do not. Modes **8×4** (A3/A4 powered) and **8×8** (all axles powered); three separate diff-lock toggles: front group, rear group, center.
- **Implementation honesty:** Current R3F toy is a four-axle single-tire-per-side illustrative placeholder, not the final 14-tire visible geometry. `approved-profile.ts` records target axle/powertrain data, but does not implement all wheel renderers, authentic physics or controls. Future AGENT tasks must not mark those as done because config constants exist.
- **Ready to proceed:** 3D scene, non-physics driving integration, model validation, garage persistence and photo-to-GLB pipeline research. Preserve axis conventions and physically consistent units.
- **Later visual-review queue:** roof airflow fairing, cab details, square arch cutouts, 14-tire lateral arrangement, parent photo-to-model likeness, steering/suspension response, front bumper cross-section, material color/LEGO studs. Review opportunistically when those details affect the feature, not as a precondition of M1 engineering work.

Reference specification: `specs/006-proportional-truck-scale/spec.md`.
