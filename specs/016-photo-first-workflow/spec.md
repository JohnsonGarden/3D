# 016 — Photo-first child-created cars, paired looks and city-order contract

Status: **requirements defined**, not a claim that photo reconstruction, structural realism or real-city maps exist. 016 first implementation slice is local multiview photo intake with truthful capture guidance; higher FRs are explicitly future.

## FR-001 — local multi-angle intake (NOW)
Given a child/guardian opens the garage, when they select several different-angle images, then the UI can display a bounded collection with thumbnail/filename, replace/clear it, and does not upload photos, create a driveable car or erase an existing garage vehicle. Invalid/oversized/non-image files are rejected with actionable feedback. Browser-session preview URLs are released on replace/clear/unmount. For this phase show local JPEG/PNG/WebP; HEIC needs explicit support/decoder verification before promising it.

## FR-002 — useful honest guidance (NOW)
Given a selected photo set, when viewing it, then the UI explains useful front/rear/left/right/overhead views, lighting/obscuration and a ruler/known brick size. Number of files alone must **not** be presented as proof of complete view coverage or scale. Show in plain language that photo→GLB is **not implemented** yet.

## FR-003 — existing driveable garage continuity (NOW)
Given a child has a saved GLB car and an active driving session, when photos are selected, replaced or cleared, then the existing model, browser garage and drive mode stay unchanged; selecting photos requires no account or server. Existing GLB manual import/export remains accessible.

## FR-004 — actual brick-style photo reconstruction (FUTURE)
Given adequate multiview photos plus scale cues, when reconstruction succeeds and quality is reviewed, then create a **car-specific** brick/pixel-style mesh/GLB with observable color, studs/part silhouette, wheel count and body geometry; mark measured, inferred and occluded details and failures honestly. Unknown underside cannot be silently guessed and presented as scanned fact. A parent approval gate precedes “faithfully reconstructed.”

## FR-005 — reversible authentic realistic-style transformation (FUTURE)
Given an approved brick-derived car and a derived automotive-style geometry variant tied to the **same canonical vehicle identity**, when the user switches style in garage or drive scene, then both variants preserve key structure (cab/body, wheel station count/position and proportional bounds), wheel/drivetrain/collision metadata and driving state. Realistic is a structure-aware design transformation, not a global material filter or unrelated generic model. When counterpart absent, show unavailable/needs generation, not a counterfeit option.

## FR-006 — per-car physical scale and safety (FUTURE pipeline)
Given dimensions/stud references or uncertain measurements for different children's cars, when preparing a driveable asset, then store original dimensions, a **single** uniform play-scale multiplier, confidence, oriented wheel stations and provenance. Legacy 2.50m truck-width fixture cannot be applied blindly to all assets. No autosubmission of child images to remote systems; any optional server-side processing later requires transparent opt-in guardian consent and provider policy review.

## FR-007 — simulated roads first (ROADMAP)
Given real-city assets are unfinished, when child presses start, then a fictional drivable environment with roads/collisions/remountable garage works; no GPS-accurate claims. Prioritize driving stability, simple terrain, perceived smoothness and responsive controls over authentic-city map width.

## FR-008 — future cities and fidelity priorities (ROADMAP)
Given a city-mapping milestone has been explicitly started, when selecting geographic data and validating the map, then implement downtown only in the ordered sequence **Stockholm → Frankfurt → Los Angeles**. Road connectivity, street orientation and relative building block/landmark layout track authoritative licensed geo data and defined downtown boundaries; building textures may be simplified, environmental lighting/terrain visually believable. Fictional LA-inspired test scene doesn't count as a real-city deliverable. Do not copy SnowRunner or proprietary map/3D assets.

## Acceptance / explicit non-goals for 016 MVP
- Browser selects 2+ JPEG/PNG/WebP files, sees a numbered list/previews; invalid count/size fails clearly; replace and clear revoke old blob URLs.
- Nothing posts to a remote endpoint or touches indexed GLBs.
- “Photo→3D not online yet” is visible; user must still import GLB to drive a personalized car.
- Automated unit tests cover file selection validation; Chromium E2E covers local photo upload, replacement, clear and retained GLB upload. Manual Mac/Safari and HEIC remain unverified.
- No automatic 3D reconstruction, real-world-style counterpart, per-vehicle generated asset, city GIS map, remote inference, HEIC conversion, or server in this slice.
