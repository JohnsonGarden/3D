# 025 — Future browser-first Docker deployment and mobile play

Status: **user-confirmed product/hosting requirement (2026-10-18), specification only; NOT deployed or implemented.** Keep existing local preview working and prioritize photo-derived vehicles/garage/driving before a cloud backend.

## User story
As a child/guardian, I can open the same HTTPS game URL on a phone, tablet or computer, enter the 3D driving world in the browser, and play without installing an app or launching developer tools. As a parent, I can deploy and update the game reproducibly with Docker Compose without silently transferring children's photos or garage files to a server.

## FR-001 — Container-served browser app (FUTURE)
Given a tagged application source and a host with Docker, when an operator builds and starts the defined container deployment, then a reproducible production **Vite static build** is served by a lightweight HTTP server; the browser performs Three.js/WebGL rendering and simulation. The container is not a GPU game-streaming server or an AI inference endpoint. Avoid Mac-specific runtime paths, a server-side Node dev process and manual npm startup on the end-user device.

## FR-002 — Phone/tablet/desktop access (FUTURE)
Given a valid game URL on a supported modern desktop or mobile browser, when a child opens it on iPhone Safari, Android Chrome or desktop Chrome/Safari, then the game is playable without app installation, a mandatory account or camera/mic permission. Keyboard input remains supported on desktop; existing two-pointer touch steering/throttle/brake must remain usable on real phones, including safe areas, rotation/resize, background/resume and WebGL errors with a visible fallback. Landscape should be comfortable; portrait must either be usable or clearly offer a nonblocking rotate hint. PWA install is optional, not a prerequisite.

## FR-003 — Secure public web entry (FUTURE)
Given an operator-configured domain, when accessing the public game, then TLS/HTTPS terminates at an explicitly documented reverse proxy or equivalent ingress; the only intentional public entry is configured HTTPS, not Vite's development server, the Docker daemon, management ports or an unauthenticated upload API. Deployment uses least privilege (non-root runtime where supported), pinned build inputs, secrets outside the built image, basic request/security headers and a documented healthcheck/rollback. Do not conflate existing 127.0.0.1 local preview with the future external site.

## FR-004 — Honest per-origin garage and default privacy (FUTURE)
Given an installed public game URL, when a guardian saves a GLB or selects photos, then current **IndexedDB remains browser+origin local**, not magically shared across devices. Child photos, EXIF, audio and model bytes are not automatically uploaded by hosting the site. Existing manual GLB export/reimport remains available; switching origins or devices requires deliberate user action and safe retention of originals.

## FR-005 — Portable low-ops deployment and acceptance (FUTURE)
Given a clean server and documented environment, when the operator runs a versioned Docker Compose deployment, then startup, upgrade/rollback and persistence assumptions are documented and can be checked with HTTP health response and browser smoke tests. A small 2 vCPU / 2 GB VPS is an **initial static-hosting evaluation target**, not a proven capacity or mobile-FPS guarantee. Server assets, network load, real-device GPU/browser performance and concurrent sessions require measurements before capacity claims.

## FR-006 — Optional consent-based cloud garage later (ROADMAP ONLY)
Given a separately approved cloud-sync milestone, when a guardian explicitly enables upload/sync, then authentication, per-user authorization, private model access, quota/backups, deletion/retention and child-data permissions are specified and tested *before* any personal asset leaves the browser. No cloud storage, account, backend API or silent synchronization is included in this 025 specification-only increment.

## Non-functional and privacy constraints
- Browser-first and static-hostable initial distribution; 3D performance depends primarily on the **client device**, with server responsible for HTTP/static asset delivery.
- Target first-drive <30 seconds on reference devices after successful load; target smooth mobile interaction, provisionally median >=30 FPS on named phone/browser/scene under actual measurement; 60 FPS desktop remains a target, not a result.
- Preserve deterministic driving, accessible input, local-only asset behavior and explicit WebGL fallback.
- Protect original HEIC sources and third-party asset/map licensing; never package family photos into the publicly served image.

## Explicit non-goals / honesty
NOT a delivered Docker image, running HTTPS site, verified iPhone/iPad build, PWA, cloud garage, multiplayer, remote child photo reconstruction, GPU rendering backend, or performance benchmark. 025 first records a contract so later implementation can be delivered in small testable slices without interrupting 024 or destructively migrating the local garage.

## Acceptance
Each FR has a concrete automated/manual verification target in test-matrix.md. Until CI + real devices + operator smoke pass, mark all implementation/hosting claims **pending**.
