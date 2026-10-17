# 019 — Privacy-preserving in-browser capture quality hints

Status: user-visible heuristics; NOT computer-vision reconstruction or certified image scoring.

## User intent
Before asking a child to reconstruct a self-built toy car, the guardian gets lightweight **on-device** cues about a photo that is very dark, saturated white, too small or too featureless. Quality hints complement explicit manually labeled 018 views and actual human inspection; no photo reaches a backend or permanent database.

## FR-001 — bounded local browser analysis
Given a selected locally previewed JPG/PNG/WebP in the garage, when its <img> successfully decodes, then a temporary 2D canvas analyzes only a bounded (max 160×160) local pixel sample. No network fetches, no data URL, no automatic file download, no IndexedDB write, no camera permission and no storage of source pixels after computation.

## FR-002 — clear, honest per-image hints
Given an image, when its true decoded dimensions or simple pixel statistics indicate low original resolution, extreme darkness/brightness or very low detail/contrast, then display an actionable caution next to that image. A viable sample shows a neutral "基础画质检查未发现明显问题" **not** a guarantee of sharpness/photogrammetry suitability. A canvas/read failure displays "未检测" without preventing photo use or GLB import. This checker cannot identify the real viewing angle, occlusion, subject coverage, reflective bricks, hidden axles, blur precisely or accurate 3D geometry.

## FR-003 — replacement and cancellation safety
Given asynchronous image decode, when the user replaces or clears a batch, then stale image onLoad results do not update the new list (match by object URL). No per-frame polling. The ordinary URL revocation cleanup of 016 is preserved.

## FR-004 — compatibility and evidence
Given CI, when Node unit tests and Chromium photo selection run, then the pure pixel-analysis heuristic behaves predictably for low-resolution, dark, bright, flat and textured input, the browser shows a result and clears it on replacement, and the previous GLB/driving/photo manifest suite remains green. Real family JPEG/PNG + Mac/Safari test remains manual.

## Non-goals
Camera capture, AI-based photo segmentation, calibrated sharpness model, automatic corrections, HEIC conversion, cloud inference, GPU neural networks, photo-to-3D generation, style conversion or city GIS.
