# 024 — Architecture and design: session-only imported GLB visual scale

## Design decisions

- Keep all saved GLB bytes, photo files, garage IndexedDB records and source dimensions unchanged. Apply a single uniform visual transform only to the active imported GLB preview at render time.
- Measure the imported GLB X-axis bounding width after normalizing the asset's own local geometry and before the optional session multiplier. The result may include mirrors or protrusions; label the resulting scale **visual only**, not confirmed body width.
- The guardian explicitly enters or confirms the target world width, and the UI requires an existing imported GLB plus complete, validated toy measurements and reviewed proportions. Reject non-finite, zero or negative widths, missing geometry and stale confirmations.
- Derive multiplier = guardian target world width / measured GLB bounding width. Apply identically to X, Y and Z, without altering underlying model geometry, orientation or ground contact; maintain the base imported GLB 2.50 m fallback.
- Keep this multiplier in ephemeral in-memory session state, keyed to the active garage selection and measurement revision. Clear it immediately when selected GLB, photo set, toy dimensions or axle layout changes. A manual revert clears the state as well.
- Route the same live render-only value through garage and driving previews. Do **not** modify car physics, collision bounds, handling, wheel rig, checkpoint progress, any exported asset, or persisted garage data.
- All operations run locally in the browser. No uploaded images, EXIF, filenames or GLB/model bytes leave the device, and no paid API call or automatic photo-to-3D reconstruction is introduced.

## Verification strategy

First add failing pure multiplier/validation/reset tests and a browser test for applying, retaining and reverting the visual preview. Then implement render-only state and UI, test both scenes, run the SDD/Node/deploy/build/Playwright CI gates, and complete a manual Safari/real-asset smoke pass before treating the feature as finished.

## Delivery rules

This spec packet can be committed independently to unblock CI. Feature implementation remains **pending** until the tests and interaction actually exist. Keep PR as draft, do not merge to main, and do not overwrite previous garage data.
