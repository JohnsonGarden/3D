# 016 — traceability & test matrix

| FR | Automated evidence target | Manual / future acceptance |
| --- | --- | --- |
| FR-001 | Unit: allowed photo types, 12-per-set, 12 MiB/file, 72 MiB/batch; Playwright: select/replace/clear thumbnails and invalid feedback | Safari/mobile file picker, memory, no remote upload |
| FR-002 | E2E: angles/lighting/scale guidance and explicit no-reconstruction status remain visible | Parent checks clarity; photo count not falsely called complete |
| FR-003 | E2E: existing saved GLB controls still present, photo selection does not replace current car | Parent confirms stored GLB and active driving unaffected |
| FR-004 | Future fixture image set + visually matched GLB QA and parent review; NOT automated/implemented now | Five photo landmarks, inferred-vs-observed labeling, assent |
| FR-005 | Future paired-asset geometry/identity test + scene style switch state continuity; NOT implemented | Child verifies structural fidelity, instant reversible switch |
| FR-006 | Future scale metadata/uncertainty invariants + no network tests; NOT implemented | Guardian approves scale and local/remote consent |
| FR-007 | Existing driving/obstacle and garage E2E; terrain realism unimplemented | Practical kid test on fictional practice road |
| FR-008 | Future licensed geodata road graph/landmark tests and coverage; NOT implemented | Stockholm center first, Frankfurt second, LA third; downtown only |

**Explicitly no false green claims.** All unimplemented feature rows are roadmap obligations, not current test passes.
