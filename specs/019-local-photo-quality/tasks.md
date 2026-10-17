# 019 tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Scope local, bounded heuristic quality cues and privacy/non-goals.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004] Commit RED pure tests and Chromium photo preview test before implementation.
- [x] T-003 [FR-001,FR-002,FR-003] Implement bounded local image analysis and photo preview integration.
- [x] T-004 [FR-004] Verify TypeScript/Node/SDD/deploy/Chromium and record actual CI.
- [ ] T-005 [FR-002,FR-004] Mac Safari and family photos manual quality assessment (pending).

## Observed CI evidence — 2026-10-17
- [Actions run 39046065551](https://github.com/JohnsonGarden/3D/actions/runs/39046065551) at initial feature PR head `36790379b7d0435d7a26840f1c15545ad6c6a38e`: **17 SDD, 81/81 Node, 17/17 deploy, 25/25 Chromium, TS/Vite build**. Both workflow jobs completed successfully; Chromium passed in one attempt without reported flaky retries. RED tests were committed ahead of implementation, but no failing CI run was observed for the RED-only phase; do not misrepresent that as an observed RED execution.
- Genuine Mac Finder/Safari and real family photograph assessments are still **not performed**. No photogrammetry, no realistic structure-derived mesh and no downtown city GIS are delivered by this PR.

- [x] T-006 [FR-005] Confirm updated 019 isolated Mac launcher plus original no-root / no-overwrite deployment tests on a new CI run.
- [ ] T-007 [FR-005] Mac Finder/Safari first download and browser origin separation manual smoke.

## 019 isolated Mac launcher verification
- Final integrated source / latest safe launcher [GitHub Actions #39046502698](https://github.com/JohnsonGarden/3D/actions/runs/39046502698) at commit `42e56b989aa66df115341a2bd527de637aa9771b`: 17 SDD packets, **81/81 Node unit tests**, **17/17 root-safe/isolated deployment tests**, **25/25 Chromium tests first-pass**, TS/Vite production build all passed. The bootstrap downloads `feat/019-local-photo-quality.zip` into `~/BrickWorld3D-preview-019` and defaults to localhost :4176, with no old-install overwrite. This does NOT verify real Mac Finder, Safari, image fidelity, reconstruction or city maps.
- Test evidence before installer update: [#39046065551](https://github.com/JohnsonGarden/3D/actions/runs/39046065551) (81 Node / 17 deploy / 25 browser; successful).
- Manual Mac evidence T-005/T-007 remains unchecked. [019 smoke checklist](../../docs/preview-019-smoke.md).
