# 010 — requirement verification matrix

| ID | Automated checks | Manual/pending |
| --- | --- | --- |
| FR-001 | Playwright: import GLB, export, capture download, compare bytes, unchanged active/list after refresh; request POST/PUT/PATCH log | Mac Finder download & browser save preferences |
| FR-002 | Node export.test.ts: filename policy, exact binary and GLB validation, limits | Different genuine child models |
| FR-003 | Node: reject invalid/malformed; Playwright: corrupted stored binary export alert and no download, entry still present | Safari denied IndexedDB / low disk |
| FR-004 | README and garage notice disclose manual backups, origin storage, local only | Parent understands backups |
 
GREEN evidence: https://github.com/JohnsonGarden/3D/actions/runs/39038932964 — 46 Node, 11 deployment, 14 Chromium tests all passed, TypeScript/Vite build and 6 SDD packets passed. Real Mac/Safari is manual and pending.
