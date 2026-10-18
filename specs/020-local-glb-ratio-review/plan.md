# 020 — architecture and design

- Pure deterministic src/garage/model-proportions.ts accepts toy cm and GLB unscaled Box3 dimensions (X width, Y height, Z length), compares two dimensionless ratios to avoid per-axis scaling. Uniform GLB scaling leaves results invariant. No Three.js import in pure helper.
- App memoizes the selected imported GLB bounding-box size; derive session-only review only with valid 018 measurements and current local 016 photo selection. Display two ratios, absolute relative differences and a >10% warning. Include explicit limitations.
- Existing GLB import/restore/drive and IndexedDB format unchanged. No backend, paid AI API, photo conversion, new dependencies or automatic provenance approval.
- RED Node + Chromium tests first; GREEN pure helper and UI; GitHub Actions SDD/Node/deploy/build/Chromium; manual real family car/Mac/Safari acceptance pending.
