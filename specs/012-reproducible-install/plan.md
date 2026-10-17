# 012 — technical plan and evidence strategy

## Design
1. RED: add a deterministic Node contract test asserting package-lock v3, manifest agreement, and CI npm ci / setup-node cache. This will fail before a lockfile exists.
2. Obtain a real npm-generated lockfile using a clean GitHub Actions Node 22 install on the feature branch; do not hallucinate registry integrity hashes.
3. Commit the generated file unchanged, update the 2 CI jobs to npm ci with setup-node npm caching and lockfile path, remove temporary emission and rerun all checks.
4. The local Bash launcher already prefers npm ci when a lock exists, so preserve its guarded behavior and test it rather than rewriting Homebrew/root checks.

## Architecture constraints
- Do not add CI privileges above `contents: read` or allow Actions to push back to repository.
- Do not use untrusted PR secrets, third-party lockfile generators or unsigned network install scripts.
- npm cache stores dependency tarballs, not arbitrary `node_modules`; CI resolves exact dependencies and verifies package integrity.
- Use the same lockfile for CI and Mac, while OS-specific optional dependencies remain platform-dependent.

## Audit
Record RED failure honestly; only mark GREEN when both GitHub Actions jobs complete successfully, and keep Mac real install manual.
