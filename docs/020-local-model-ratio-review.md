# 020 local GLB ratio review

This development feature compares manually entered toy dimensions with the bounding box of the currently selected GLB model. It requires photos selected in the current browser session, but never reads those pixels for model comparison.

The comparison uses two dimensionless ratios: length/width and height/width. A discrepancy greater than 10 percent flags manual inspection; a smaller difference is **not** evidence of faithful reconstruction. GLB X/Y/Z must represent width/height/length, and mirrors, wheels or bumpers can distort bounding-box dimensions.

No new API, media upload, geometry conversion, per-car scale approval, garage migration or model provenance claim is introduced. The previously approved sample truck's width-based 2.50m world scale remains the old import fallback, not an automatically valid setting for every toy.

### Verification
- Test-first RED: [Actions 39085126289](https://github.com/JohnsonGarden/3D/actions/runs/39085126289), Node failed on the missing module and Chromium also failed.
- Implementation GREEN: [Actions 39085396761](https://github.com/JohnsonGarden/3D/actions/runs/39085396761): 18 SDD packets, 85 Node, 17 deployment, TS/Vite build and 26 Chromium tests passed on first attempt with no retries.
- Family Mac/Safari visual and proportion acceptance is **not** complete.
- PR creation is blocked by GitHub connector safety checks; development branch is not merged into main or any base branch.

Actual multi-view photo-to-3D, structurally authentic brick mesh, per-car approved scale, automotive realistic variant and licensed city maps remain pending.
