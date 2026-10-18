# 020 local GLB ratio review

This development feature compares manually entered toy dimensions with the bounding box of the currently selected GLB model. It requires photos selected in the current browser session, but never reads those pixels for model comparison.

The comparison uses two dimensionless ratios: length/width and height/width. A discrepancy greater than 10 percent flags manual inspection; a smaller difference is **not** evidence of faithful reconstruction. GLB X/Y/Z must represent width/height/length, and mirrors, wheels or bumpers can distort bounding-box dimensions.

No new API, media upload, geometry conversion, per-car scale approval, garage migration or model provenance claim is introduced. The previously approved sample truck's width-based 2.50m world scale remains the old import fallback, not an automatically valid setting for every toy.

Current status: SDD and tests committed first; implementation committed separately. Automated GitHub Actions verification and parent Mac/Safari acceptance are tracked in the 020 tasks and branch checks. The complete photo-to-3D pipeline and structural realistic variant are still pending.
