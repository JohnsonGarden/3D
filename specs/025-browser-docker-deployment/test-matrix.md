# 025 — Acceptance and test trace (all future/pending)

| Requirement | Test or manual acceptance | Evidence today |
|---|---|---|
| FR-001 | Clean-image Docker build → Compose up → GET / returns built app; static assets load and no runtime Vite dev server; docker inspect non-root where supported. | PENDING — no Docker implementation |
| FR-002 | Playwright phone viewport regression and real iPhone Safari/Android Chrome plus desktop Safari/Chrome: play/no login, two-finger controls, keyboard, rotate, background/resume, safe area, WebGL fallback. | PENDING — no public-site real-device acceptance |
| FR-003 | Domain HTTPS/TLS probe, reverse-proxy request headers, external port scan and no exposed Docker/Vite admin ports; secrets absent from image. | PENDING — no public deployment |
| FR-004 | Browser test checks photos/GLB/audio produce no upload requests and IndexedDB is local to the origin; explicit export/reimport works across origins. | PENDING — no hosted-origin smoke |
| FR-005 | Clean Docker Compose startup, healthcheck, simulated restart and rollback; measure host memory/CPU, traffic/assets and user experience for 2-vCPU/2-GB trial. | PENDING — not benchmarked |
| FR-006 | Privacy/security design review and future contract tests for opt-in authorization, encrypted transport, ACL, delete/export, retention and quota before any sync ships. | PENDING — explicitly out of scope |

Only completed measured tests may be reported as passed. Browser CI alone does not prove phone GPU performance or network hosting capacity.
