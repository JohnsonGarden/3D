# 025 — Planned implementation approach (not implemented)

## Sequencing
1. Keep current Mac loopback preview (008/015/019) and local IndexedDB semantics unchanged.
2. After the current core-game/photo work, add a multi-stage reproducible build of the existing Vite frontend, served as static files from a non-root minimal HTTP image. Choose a maintained server implementation based on operational evidence; no running Vite dev server in production.
3. Add Dockerfile, .dockerignore, docker-compose.yml (or compose.yaml), service healthcheck and SPA fallback if routing requires it. Preserve a strictly documented HTTP internal port and no implicit public admin/API exposure.
4. Put external domain TLS/HTTPS in an optional reverse-proxy/ingress deployment example; document DNS, firewall, TLS renewal, image version pinning, rollout and rollback without committing credentials.
5. Verify browser rendering and interaction from a real iPhone Safari, Android Chrome and desktop Safari/Chrome on the final HTTPS origin. Test keyboard and two-pointer controls, rotation, safe area, WebGL fallback and downloaded GLB export.
6. Measure peak RAM, CPU, outbound traffic / asset sizes and concurrent requests on a representative 2-vCPU/2-GB VPS before making hosting capacity claims.
7. A separate later spec can introduce cloud garage only after explicit guardian-controlled opt-in, authentication/authorization, quota/backups and data retention design.

## Core decisions
- **Static frontend first**: no authoritative per-frame 3D simulation on the VPS; mobile GPU/WebGL is the rendering bottleneck.
- **Same app, multiple entrypoints**: local 127.0.0.1 launch stays separate from future Docker web build; keep local privacy default. Hosting must never change photo/GLB upload semantics silently.
- **Data migration is explicit**: host changes imply new IndexedDB origins; browser storage is not cross-device synchronization.
- **Deployment isolation**: no user media files in image/build context, no automatic database or child-data service; no requirement to use paid model APIs.

## Risks, tradeoffs and deferrals
Cloud storage offers cross-device vehicles but creates child-privacy, auth, cost, abuse and backups obligations; defer. TLS and a public domain require DNS/reverse proxy/firewall management. Client mobile memory/texture budgets remain the main technical unknown. Real device testing and server load tests are mandatory for release; no claim of ready-to-run deployment in this planning-only PR.
