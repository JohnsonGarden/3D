# 006 — SDD/TDD task sequence
- [x] T-001 [FR-001] Record user-supplied physical dimensions, source exclusions and target width in spec/plan.
- [x] T-002 [FR-001,FR-005] Author failing pure calibration and imported-model tests before implementation.
- [x] T-003 [FR-001,FR-002] Implement uniform scale and truck-scale vehicle constants.
- [x] T-004 [FR-002] Update procedural truck mesh and chase camera to match physical proportions.
- [x] T-005 [FR-003] Normalize GLB imported width only and reject degenerate model width.
- [x] T-006 [FR-004] Expose original and derived physical dimensions in garage UI.
- [x] T-007 [FR-005] Run CI spec/type/unit/build and browser test; inspect screenshots.
- [ ] T-009 [FR-006] Record new measured four-axle stations and front bumper beyond body in scale model.
- [ ] T-010 [FR-006,FR-002] Update sample renderer to four axles with eight wheels total and measured bumper projection.
- [ ] T-011 [FR-004,FR-006,FR-005] Display total length/axle spans in garage, add RED tests and get CI green.
- [ ] T-008 [FR-002,FR-003] Parent photo-to-GLB reconstruction and actual wheelbase/bumper measurement remain later human validation tasks.

Tasks checked before green implementation denote authored work only; do not mark CI pass until recorded.

### Automated convergence evidence — 2026-10-17
- Commit `a08b6467c9cd0241958470878a29160f8197c234` GitHub Actions: https://github.com/JohnsonGarden/3D/actions/runs/39028274592
- 2 SDD packets traced; 22/22 deterministic Node tests, TypeScript + Vite production build pass; 4/4 Chromium UI tests pass, including garage physical-size badges and real canvas input.
- Visual CI evidence: artifact `playable-browser-evidence` (off-axis truck following camera, stylized procedural model). Actual Mac M5 FPS, photo fidelity and source GLB import still unverified.
