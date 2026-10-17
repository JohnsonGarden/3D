# 011 — architecture and plan

## Design
- Add src/controls/input.ts pure resolver taking keyboard codes and touch action names; no frame-time allocations or React state transitions inside useFrame.
- App owns touch pointers as Map<pointerId,action> in useRef, keeps existing keyboard Set and computes a single mutable DriverInput ref on input events. Single map allows independent simultaneous pointers without duplicate event counting.
- Five native button elements use Pointer Events, pointer capture where supported and clean up for pointerup, pointercancel, lostpointercapture, garage open and window blur.
- CSS touch hit targets only for coarse pointer <=900px; preserve full keyboard help on desktop, hide overlapping keyboard cheatsheet when touch buttons are displayed.
- Build Node tests and Playwright Chromium emulated mobile test; assess actual device/FPS separately.

## Tradeoffs
- Pointer Events are standard and avoid tracking touchstart/touchend separately. They also work for mouse accessibility/testing.
- Use onPointer* React event callbacks with preventDefault and CSS touch-action:none to prevent scrolling during press. No long-lived listeners on child buttons.
- Keep velocity rolling resistance when releasing accelerator (current physics behavior); "release" means neutral input, not an emergency stop.
- No extra per-frame React setState for buttons.

## Harness sequence
SPEC → RED unit + browser acceptance → GREEN pure resolver and responsive UI → REFACTOR → CI results and screenshots → real device acceptance.
