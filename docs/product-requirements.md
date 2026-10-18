# Product requirements / 产品需求基线 — 2026-10-17

Status: **user-confirmed target experience**; individual capabilities are not necessarily implemented. Source of truth for future scope together with the Constitution and versioned SDD specs. Product priority is photo-generated cars, garage and enjoyable driving **before** real-city mapping.

## 1. North-star user journey (child + guardian)

1. Child physically builds an original LEGO-style brick vehicle.
2. Child / guardian shoots **several photos from different angles** (front, rear, both sides, three-quarter views; upper/underside where safe); game gives coverage, sharpness and scale-reference guidance. Photos should not need cloud upload by default.
3. Game converts those photos into a **recognizable, structurally faithful, drivable 3D vehicle**, subject to reconstruction-quality checks. A missing view or unknown dimensions must be requested or labeled uncertain, not fabricated and called exact.
4. Default playable appearance is **LEGO / brick-pixel style**, preserving studs, brick silhouette, colors, body/wheel structure and design identity; uniform proportion-preserving world scale with physically meaningful metadata.
5. User can **freely switch LEGO / brick-pixel ↔ realistic vehicle style** for the same car **once both authentic variants are available**. The realistic variant must be **structurally derived** from the child's original build (cab/body layout, axle count, wheel stations, proportions, key attachments), with automotive-like bodywork, material/shading and silhouette; **not** just recolor a generic car or apply a photorealistic texture to blocks. Child can switch back without losing identity, car selection or driving progress. While realistic geometry is unavailable, clearly say **not yet generated**; don't fake success.
6. Child inspects the car in a garage, saves/selects/revisits vehicles and enters **simulated-road driving**. The photo-to-3D loop should ultimately be the default onboarding path; manual GLB remains a useful advanced/import fallback.

## 2. Scaling and structural fidelity

- 1 Three.js unit = 1 world meter. Record **physical toy dimensions or known stud pitch**, uncertainty and source. Preserve all observed vehicle dimensional ratios with **one isotropic multiplier** for car-sized road gameplay; do not independently stretch length/width/height or mislabel the play-scaled car as literally toy-sized.
- Existing approved truck measurement / 2.50 m world-width calibration is **one fixture for the first vehicle**, **not a hardcoded target for every child's different creation**. Future vehicles require individual scale metadata and approval or a marked suggested scale.
- Preserve wheel count/spacing, steering/driving axle semantics when known; do not infer unseen undercarriage, steering or drivetrain hardware as measurements.
- Reconstruction results require parent/child-facing side-by-side review and an explicit approval state before calling the result authentic or generated from this exact car.
- Render style and physical/driveable identity are separate: switch appearance only, keep the same canonical underlying dimension/wheel/collider definition unless the parent explicitly approves a different physics proxy.

## 3. Simulation and environments

**Now / early:** polished garage, photo capture/reconstruction pipeline and stable driving on imaginary practice roads, junctions, obstacles and manageable terrain. These need **no real-world mapping precision**. Prioritize controllability, collisions, frame pacing, touch/keyboard, quick reset and local deployment.

**Later / city simulation:** create only the **central-city area** initially, in this **strict order**:
1. **Stockholm / 斯德哥尔摩** (first)
2. **Frankfurt / 法兰克福** (second)
3. **Los Angeles / 洛杉矶** (third)

For a named city's center, **actual street connectivity, orientation and relative positions / footprints of significant blocks and buildings** are higher priority than photorealistic textures. Select and record the exact downtown boundary and source dataset at the start of each city milestone; validate recognizable routes/landmarks against licensed, versioned geospatial sources. Appearance target: cohesive, credible off-road / open-world landscape rendering (SnowRunner-level **inspiration**, not copied shaders, textures or assets); low/mid-detail building materials are acceptable. Optimize geographic plausibility, performance, lawful map data and recognizability over exhaustive block count. Avoid assuming copyrighted 3D tiles or textures are usable.

The existing “LOS ANGELES INSPIRED” **fictional test strip** is **only a development sandbox**, not the first official city or a map of Los Angeles.

## 4. Privacy, safety and provenance

- Child media is **local-first**; no default account, implicit camera permission, network transfer, analytics or location extraction. Strip EXIF GPS on any export that is specifically consented to.
- Remote AI reconstruction, if technically required later, needs an explicit guardian-aware consent step, transparent provider/data retention and an offline/manual fallback. Do not imply that this pipeline runs offline until validated.
- Retain original photos under guardian control, model provenance/rights, reconstruction confidence and mesh version; no automatic upload/public share. Protect the six supplied HEIC originals; never rewrite them.
- Existing browser IndexedDB garage is per-origin, six GLB slots and not a guaranteed backup.

## 4A. Cross-device web release / Docker deployment (user-confirmed 2026-10-18; FUTURE)

**Target experience:** Guardian deploys the same game as a static browser application on a small server using Docker Compose and a domain with HTTPS. A child launches that website directly from iPhone Safari, Android Chrome, a tablet or desktop Chrome/Safari, with no app installation, client-side developer tooling or mandatory account. The Three.js/WebGL scene and driving simulation run on each **client device**, not the VPS GPU. The current local Mac launcher remains supported and independent.

- Require a reproducible production build with a lightweight non-root container where supported, documented Compose/healthcheck/rollback, HTTPS reverse proxy, limited public ports and no secrets inside image layers.
- Real-mobile release gate: touch and two-pointer driving, safe-area controls, screen rotation/landscape usability, resume, WebGL fallback and measured FPS on actual iPhone/Android devices. Desktop keyboard/garage workflows must not regress. **No claim of mobile compatibility or server capacity solely from Chromium CI.**
- A 2-vCPU/2-GB VPS is a plausible **static asset hosting trial**, not a verified throughput/performance specification. Client GPU and asset/network budgets are evaluated separately.
- Preserve child-media privacy: website hosting does **not** upload photos, music or imported GLB by default. Browser IndexedDB garages are isolated by origin and device; no implicit cross-device sync or silent migration. Keep explicit per-GLB export/import.
- Optional cloud garage is a separately authorized milestone after authentication/authorization, explicit guardian upload opt-in, quotas, secure access, retention and backup rules. Do not add accounts, AI/photo processing APIs or multiplayer as prerequisites to first hosted release.

**Scope and precedence:** This is a future delivery requirement; keep child photo-to-car, garage and satisfying driving ahead of a speculative backend. The canonical observable acceptance is in [025 Docker/browser SDD](../specs/025-browser-docker-deployment/spec.md); writing the requirement does not imply production deployment has happened.

## 5. Phase priority and quality gates

P0: **garage + road driving quality / stable isolated local preview** (existing implementation foundations).
P1: **multi-angle photo import, photo coverage feedback, authentic brick-style GLB pipeline and family verification**.
P2: **structural realistic counterpart + instantaneous reversible style selection**.
P3: better surface physics, terrain and graphical credibility; iterate alongside driving as useful.
P4: **Stockholm center → Frankfurt center → Los Angeles center**, licensed geo-alignment with manual map acceptance.

Each milestone needs SDD Given/When/Then, test matrix, deterministic checks, browser smoke and real-device appearance/fidelity review. No claim of “automatically generates from photos,” “photo-authentic,” “photorealistic structurally transformed,” or “real Stockholm” without the corresponding implemented and accepted evidence.

## 6. Definition of done (product-level targets, not achieved)

- Guardian can pick multiview photos and receive accurate local guidance about missing angles/scale and reconstruction readiness.
- A photo-derived brick vehicle (not sample model) is recognizably faithful in at least **4 of 5** parent-identified silhouette/structural landmarks, with clear handling of unseen portions.
- A generated authentic brick GLB saves/restores in garage and drives at the **same wheelbase/body ratios** recorded for that vehicle under a single visual scale multiplier.
- A **paired** structural realistic rendition is visually checked against the same original car; style switching preserves core dimension, selection and sim state.
- An initially modest road network is fun before any real map exists.
- Each downtown launch has city/extent provenance, tests of route connectivity and landmark positioning, and honest labels for incomplete coverage.

See [016 requirements Spec](../specs/016-photo-first-workflow/spec.md), [reconstruction pipeline](asset-pipeline.md), [roadmap](roadmap.md).
