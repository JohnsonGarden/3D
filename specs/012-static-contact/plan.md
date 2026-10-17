# 012 — contact system design

## Architecture
- Add src/world/city-layout.ts to describe solid city building/kiosk footprints as immutable gameplay coordinates. Renderer and pure collision adapter share the same coordinates; preserve all existing buildings and one new obvious roadside kiosk target.
- Add src/sim/contact.ts with rotated rectangular footprint SAT (world X/Z and truck axes). Truck body footprint uses 2.50m width, front body edge plus measured 0.645m bumper, rear body edge unchanged.
- On each fixed step, call unchanged advanceVehicle, then sweep/interpolate from previous state to next at <=0.25m of movement or <=0.025rad heading increments; bound steps, binary-search last safe point. Contact stops speed to zero and raises a 'hit' boolean.
- R3F loop never setState on every frame. It invokes collision feedback callback on state transitions only (hit/recover/reset). App HUD exposes an accessible short Chinese contact message with recovery hint.
- Keep movement deterministic and independently tested without Three/WebGL; no new physics dependencies.

## Risks and tradeoffs
- Arcade conservative OBB boundary only; trees, curbs and thin signage are not collision meshes. Imported GLBs visually larger than the placeholder bbox can still appear to collide early/late. Call it a collision proxy, not exact mechanics.
- No ground Y or vehicle roll; side sliding and wheel friction are intentionally deferred.
- Static 42-object list is cheap; long-term chunked streets need spatial lookup/partitioning.
- Long fixed-state sweeps are rejected rather than doing unbounded CPU work. Real-world fixed-step displacement remains <=0.37m for normal 22m/s limit.

## Harness
SPECIFY → pure SAT/step tests RED → minimal city generator + solver GREEN → wire R3F → Chromium collision marker and keyboard recovery → regression CI and manual follow-up.
