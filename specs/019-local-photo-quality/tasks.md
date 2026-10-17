# 019 tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Scope local, bounded heuristic quality cues and privacy/non-goals.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004] Commit RED pure tests and Chromium photo preview test before implementation.
- [x] T-003 [FR-001,FR-002,FR-003] Implement bounded local image analysis and photo preview integration.
- [x] T-004 [FR-004] Verify TypeScript/Node/SDD/deploy/Chromium and record actual CI.
- [ ] T-005 [FR-002,FR-004] Mac Safari and family photos manual quality assessment (pending).

## Observed CI evidence — 2026-10-17
- [Actions run 39046065551](https://github.com/JohnsonGarden/3D/actions/runs/39046065551) at initial feature PR head `36790379b7d0435d7a26840f1c15545ad6c6a38e`: **17 SDD, 81/81 Node, 17/17 deploy, 25/25 Chromium, TS/Vite build**. Both workflow jobs completed successfully; Chromium passed in one attempt without reported flaky retries. RED tests were committed ahead of implementation, but no failing CI run was observed for the RED-only phase; do not misrepresent that as an observed RED execution.
- Genuine Mac Finder/Safari and real family photograph assessments are still **not performed**. No photogrammetry, no realistic structure-derived mesh and no downtown city GIS are delivered by this PR.

- [ ] T-006 [FR-005] Confirm updated 019 isolated Mac launcher plus original no-root / no-overwrite deployment tests on a new CI run.
- [ ] T-007 [FR-005] Mac Finder/Safari first download and browser origin separation manual smoke.
