# 019 — minimal architecture

- src/garage/photo-quality.ts: pure scalar summary of already-decoded ImageData (original pixel dimensions passed separately, sample up to 160×160), deterministic mean luminance/contrast/neighbor variation, conservative heuristic status. No canvas or browser side effects in pure tests.
- App.tsx: use <img onLoad> to call a local bounded canvas draw+getImageData for current object URL only; store one quality result per photo. Any failure gives neutral "检测不可用" without blocking import or exposing file contents. Clear/replacement discards old statuses. Reuse session-only preview URL lifecycle.
- CSS: compact quality status under photos and non-overclaiming disclaimer.
- No dependencies, server, third-party image recognition, user profile, storage schema change, GLB transformation or scene changes.

## Caveats
- Original width/height are checked before small canvas downscaling, preventing 1×1 previews being falsely accepted just because they upscale.
- A uniformly painted LEGO body, blank background or very zoomed-out photo can trigger low-detail advisory. Avoid a hard "unusable" verdict. Manual review is final.
- Cross-origin restrictions cannot arise from local object URLs normally, but exceptions are caught.
- The selector remains the same JPG/PNG/WebP subset; Safari HEIC cannot be claimed supported without actual decoding proof.

## Preview release safety
Reuse tested standalone download command but point to `feat/019-local-photo-quality`, in a new `~/BrickWorld3D-preview-019` directory on 4176. Keep all original checks and preserve 4173/4174/4175. Run deployment contract tests before presenting a Mac download link. Downloaded source is a feature branch, not an auto-updater or notarized application.
