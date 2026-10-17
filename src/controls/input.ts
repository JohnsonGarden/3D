import type { DriverInput } from '../sim/vehicle.ts'

export type TouchAction = 'accelerate' | 'reverse' | 'left' | 'right' | 'brake'

/** Pure keyboard + touch resolution, called only on input changes, not per frame. */
export function resolveDriverInput(
  keys: ReadonlySet<string>,
  touches: ReadonlySet<TouchAction>
): DriverInput {
  const forward = keys.has('w') || keys.has('arrowup') || touches.has('accelerate')
  const reverse = keys.has('s') || keys.has('arrowdown') || touches.has('reverse')
  const left = keys.has('a') || keys.has('arrowleft') || touches.has('left')
  const right = keys.has('d') || keys.has('arrowright') || touches.has('right')
  return {
    throttle: Number(forward) - Number(reverse),
    steer: Number(right) - Number(left),
    brake: keys.has(' ') || touches.has('brake')
  }
}
