# 023 — Per-car uniform world-scale handoff

This step adds a guardian-chosen target gameplay body width (0.50–4.00 m) to the manual wheel-measurement panel. The browser previews the proposed dimensions and explicitly exports a numeric JSON handoff. The original centimetre wheel-layout export is retained.

All body and axle measurements use **one uniform factor**: target width in metres divided by physical toy width in metres. For the example 10.4 × 3.1 × 4.7 cm toy, entering 2.50 m produces approximately 8.39 × 2.50 × 3.79 m. Axle Z uses body centre as zero, with negative Z forward. Each new car needs its own width decision.

This proposal does **not** scale GLB geometry, rig wheels, modify garage storage, update driving physics or reconstruct anything from photos. Its JSON contains numeric metadata only; photos and HEIC originals remain untouched. Parent/Safari/manual acceptance is pending.

Acceptance: specs/023-per-car-world-scale-handoff. Next milestone: review per-car GLB body-width landmarks and an explicit, reversible gameplay transform with collider agreement.
