# 018 — Explicit photo angles, scale notes and a portable local capture manifest

Status: initial capability, NOT automated photogrammetry or generated GLB.

## Parent goal
A guardian can prepare meaningful multi-angle capture evidence for their child's physical brick car before any AI reconstruction exists. The garage must **not** call a collection of images a reconstructed asset. Annotation and measurements are explicit, not inferred from filenames or blurry image classification.

## FR-001 — Each photo has a manually chosen viewpoint
Given a valid selected JPEG/PNG/WebP set in the 016 garage preview, when the guardian changes a photo's viewpoint, then it is associated with that **photo only** until a replacement or clear; other photo URLs, GLB selection, drivetrain and world remain intact. Supported labels: unassigned, front, rear, left, right, front-left, front-right, rear-left, rear-right, top, bottom. Filenames never auto-classify shots.

## FR-002 — Honest coverage and missing-view feedback
Given assigned labels, when the capture checklist updates, then it identifies missing front/rear/left/right/top **and at least one diagonal** photo. Duplicate angle labels do not count as new coverage. A complete checklist says only **angles annotated**, not "true reconstruction ready"; blur, occlusion, scale and photo alignment are not verified computationally. Partial coverage shows exactly which directions are still missing.

## FR-003 — Per-vehicle physical dimensions (toy centimeters)
Given guardian-measured body length, width and highest point, when entered, the fields accept all finite positive numbers in a bounded range (0.5–200 cm) as **original toy** dimensions, separate from the hard-coded first truck/drive scale. Missing or invalid dimensions must never be shown as verified; no invented measurements or non-uniform world scale. This 018 form does NOT yet apply a scale factor to imported GLBs.

## FR-004 — Explicit portable metadata handoff
Given the photo selection, assigned directions and optional dimensions, when clicking **导出采集清单 JSON**, then the browser downloads a small **photo-free** manifest with format version, original file names/types/sizes, annotations and trustworthy declared dimensions (or null). No binary photo data, blob URL, GPS/EXIF, account IDs, cloud calls or local persistent database writes. Metadata file names themselves can be sensitive, so download requires a deliberate click. A replacement/clear keeps no old annotations or URLs.

## FR-005 — Regression / privacy / truthfulness
Given no supported reconstruction backend, when interacting, the interface continues to say "照片还不能自动生成 3D 模型"; current GLB import/export, six-car garage, touchscreen, collision and fictional roads continue to work. CI covers pure validation, manifest sanitization and browser UI/download/no-network behavior. Child media remains in browser memory only and original HEIC files remain untouched.

## Non-goals
Automatic viewpoint detection, deblur/occlusion computer vision, HEIC support, automatic photo-to-mesh, car-specific 3D dimensions, paired structural realism, city GIS maps and remote upload.
