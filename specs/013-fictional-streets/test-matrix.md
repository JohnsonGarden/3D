# 013 — test matrix

| Requirement | Automated acceptance | Manual / pending |
| --- | --- | --- |
| FR-001 | src/world/street-layout.test.ts: three crossings and 7m roadway, predictable Z positions + lengths | Actual child test of steering right/left at crossroads |
| FR-002 | Pure test: no building footprint on roadway, crossroad centerline gaps, curb cuts at junctions | Visual screenshot inspection / future colliders |
| FR-003 | Pure test: exact repeatability, bounded building/mark counts; World renderer uses two instanced meshes | GPU draw calls via profiler, FPS median / p95 on reference Mac |
| FR-004 | Chromium: WebGL and factual fictional-junction label plus regression | Real Safari mobile and physical model handling |

RED before implementation. Do not mark GREEN until actual GitHub Actions results are available.
