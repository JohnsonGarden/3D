# 009 — requirement verification matrix
| ID | Automated evidence | Manual/pending |
| --- | --- | --- |
| FR-001 | Chromium real GLB upload + IndexedDB metadata/bytes and active HUD | Parent-approved full GLB visual import |
| FR-002 | Playwright page.reload() restores name, saved car and current active | Safari/local-one-click origin consistency |
| FR-003 | Playwright switch sample/GLB; delete cancel/confirm and last selection reset | Child usability |
| FR-004 | Playwright corrupt saved payload fallback; pure adapter max slots & data validation | Browser quota/private mode, disk eviction |
| FR-005 | Playwright overlay and keyboard still usable; no upload requests | Network tab manual review |
| FR-006 | GitHub Actions combined `npm run ci` and Playwright | Record CI run and screenshot |

No full binary external network traffic or cloud upload is permitted. Test should not claim all 3D imported source GLBs always work.

## Green evidence — 2026-10-17
Run https://github.com/JohnsonGarden/3D/actions/runs/39035059140, commit `485bb7aa80788fbf04af3224aa6d1550424eed5c`: all 43 Node tests + 9 deploy tests + 12 Chromium tests passed; SDD validator/TS/Vite build green. `playable-browser-evidence` artifact includes actual Chromium garage screenshot after uploading a geometry-bearing self-contained GLB. E2E asserts reload restore, sample-vs-stored selection, deletion cancel/confirm, corrupt binary recovery, six-slot cap, no HTTP POST/PUT/PATCH.
Manual limitations: real Mac/Safari, private mode/quota eviction, real HEIC-derived GLB and accurate model likeness, user backup/export/metadata thumbnails.
