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
