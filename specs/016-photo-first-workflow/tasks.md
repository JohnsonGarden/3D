# 016 — tasks

- [x] T-001 [FR-001, FR-002, FR-003] Record explicit multi-angle/local-first onboarding and gap between photos and reconstructing car.
- [x] T-002 [FR-004, FR-005, FR-006] Specify honest real-brick model, paired structural realism and per-car isotropic scale/identity contract.
- [x] T-003 [FR-007, FR-008] Supersede LA-first roadmap; fictional roads now, Stockholm → Frankfurt → Los Angeles downtown only later.
- [x] T-004 [FR-001, FR-002] Write RED deterministic validator tests and implementation.
- [x] T-005 [FR-001, FR-002, FR-003] Implement session-only garage multi-angle photo preview, replace/clear, honest guidance and revocation.
- [x] T-006 [FR-001, FR-002, FR-003] Chromium E2E and automated CI, log verified commands/runs.
- [ ] T-007 [FR-001, FR-002, FR-003] User Mac/Safari manual photo picker + blob release and mobile touch/finder smoke.

## Deferred (unimplemented by design)
- [ ] T-008 [FR-004, FR-006] Real photo→brick GLB/review and individual physical measurements.
- [ ] T-009 [FR-005] Authentic structure-derived realistic variant and gameplay style toggle.
- [ ] T-010 [FR-007, FR-008] Licensed, checked Stockholm central street data; later Frankfurt, then Los Angeles.

Not checked tasks are not delivered. Capture CI evidence below after actual execution.

## TDD evidence — GitHub Actions 2026-10-17
- RED commit `78cf35cacf7707cc1b8fb4eb1d1bd05a8bf3d7f6`: Actions run [39042629009](https://github.com/JohnsonGarden/3D/actions/runs/39042629009) failed: Node ERR_MODULE_NOT_FOUND for `src/garage/photo-intake.ts`; Chromium photo intake scenarios unavailable.
- GREEN implementation at `0a19318a061de00a8d065e66c6cf9fcea4d5eb8a`: Actions run [39042750609](https://github.com/JohnsonGarden/3D/actions/runs/39042750609), **12 SDD packets**, **68/68 Node tests**, **14/14 deploy tests**, **21/21 Chromium E2E**, TS/Vite build successful. Unit/CI evidence is Linux/Chromium, **not** Mac Finder / Safari / family photo-fidelity or photo-to-mesh proof.
- Real family photos remain on protected source branch and were **not** imported, modified or uploaded as a result of this feature. Local image data stays transient in browser memory.
