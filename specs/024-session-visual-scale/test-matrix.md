# 024 — Acceptance test matrix

| Requirement | Automated acceptance (planned) | Manual acceptance (planned) |
| --- | --- | --- |
| FR-001 | Bounding-width input yields one positive isotropic multiplier; X/Y/Z aspect ratios and ground alignment invariant | Compare imported model before/after; explain mirrors/protrusions affect width |
| FR-002 | No GLB, incomplete toy/axle data, invalid/nonfinite target, unreviewed proportions or stale confirmation leave state unchanged | Check rejected actions and explicit visual-only notice |
| FR-003 | Changing GLB, photos or measurements invalidates multiplier; manual revert restores default 2.50 m | Switch vehicles, replace photos and revert without deletion |
| FR-004 | Garage-to-driving-to-garage keeps same ephemeral visual scale; physics/collision/wheels/checkpoints/IndexedDB untouched | Drive the scaled preview and inspect saved model integrity |
| FR-005 | Browser interaction issues no photo/model/EXIF/filename network uploads and uses no paid AI API | Safari Network inspection and local HEIC originals remain private |

The matrix describes **planned** tests, not passing test evidence. Run the project’s `npm run ci` and `npm run test:e2e` gates after implementation. CI passing with only this specification packet does not establish that 024 scaling functionality exists.
