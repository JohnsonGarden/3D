# 021 architecture and design

Keep five stable review criteria and deterministic 0–5 eligibility in a pure `src/garage/landmark-review.ts` helper. React stores checkbox selections and an explicit human confirmation in memory only. A review identity key includes selected GLB, existing selection version, and the active photo object URLs. A new selection or photo set invalidates all prior checks and confirmation.

Never persist, export, or infer authenticity from these choices. An alternate "approved" flag stored in IndexedDB is rejected because the app has no basis to verify real-world reconstruction fidelity. Browser tests cover checkbox accessibility, switching and reselecting models, photo replacement, reload and no network writes. Real parent photo/GLB comparison remains manual.
