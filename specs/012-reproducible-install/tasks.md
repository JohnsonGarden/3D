# 012 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004] Specify reproducible install and make verification matrix.
- [x] T-002 [FR-001,FR-002,FR-004] Add failing lockfile/CI contract test first.
- [x] T-003 [FR-001] Generate real npm lock from Node 22 installed dependency graph and commit package-lock.json.
- [x] T-004 [FR-002,FR-003] Change both CI jobs to npm ci + lock-keyed cache, preserve one-click npm ci and root guard.
- [x] T-005 [FR-004] Run complete tests/Chrome CI and record lockfile integrity and pass counts.
- [ ] T-006 [FR-003,FR-004] Real Mac Finder fresh-archive npm ci smoke (manual).

## Convergence — 2026-10-17
- Actual Node 22 CI npm install resolved an npm v3 lockfile with 145 package entries and registry-derived integrity data; committed the resulting package-lock.json (not handwritten).
- Both GitHub Actions jobs now run frozen npm ci --no-audit --no-fund with cache-dependency-path: package-lock.json; temporary CI lock-print bootstrap removed.
- GREEN evidence: https://github.com/JohnsonGarden/3D/actions/runs/39039886486 at docs HEAD `88b01474be898231720416d76e4b8cbf524549da`; 8 SDD packets traced, 49/49 Node tests, 14/14 deployment tests, 16/16 Chromium browser tests, production TS/Vite build green.
- Previous code CI https://github.com/JohnsonGarden/3D/actions/runs/39039820078 also passed under frozen npm ci.
- Mac Finder, signed-app, storage quota and actual M5 first npm ci must not be reported as validated; T-006 remains manual.
