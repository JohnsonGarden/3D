# 020 — Local measured-to-GLB proportion review (not reconstruction)

Product trace: docs/product-requirements.md §2 and §6. This is manual screening, not model generation.

## FR-001 — manual reference comparison
Given a guardian has selected at least one local photo, entered valid physical toy body length/width/height in cm and selected a manually imported/saved GLB, when the garage is visible, then show its axis-aligned bounding-box length/width and height/width ratios alongside the toy's declared ratios. Model X=width, Y=height, Z=length. No image pixels enter geometry calculations.

## FR-002 — deterministic advisory, never authenticity certification
Given finite positive dimensions, when either relative ratio discrepancy is greater than 10%, then show "比例存在偏差，请人工复核" and each percentage difference. Otherwise show "外接框比例接近，仍需人工核对结构". Neither result certifies bricks, wheelbase, model identity, photo origin or reconstruction quality.

## FR-003 — safe fallback and backward compatibility
Given missing/incomplete/invalid toy measurements, no photos, sample car or no selected GLB, when the garage renders, then show no completed ratio comparison. Existing photo previews, GLB import, six-slot IndexedDB garage and driving remain unchanged. No network writes, photo/EXIF persistence, storage migration, GLB geometry mutation or per-axis stretching.

## FR-004 — reversible, session-only feedback
Given a comparison, when dimensions change, photos are cleared/replaced or the sample car is selected, then the result updates or disappears immediately. Reload does not restore the review without reselecting photos and entering dimensions. No "approved" state is stored.

## Non-goals
Automatic photo-to-3D, HEIC conversion, per-car approved world scale, realistic mesh pairing and authentic city maps. The GLB bounding box may include mirrors, bumpers, wheels or attachments, whereas measured toy dimensions may refer to body only. The existing 2.50m width fallback is unchanged.
