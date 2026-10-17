/** Limit tab-pause catch-up to protect interactive frame pacing. */
export function tickFixed(
  accumulator: number,
  elapsedSeconds: number,
  step: number,
  maxSteps: number,
  update: () => void
): number {
  if (![accumulator, elapsedSeconds, step, maxSteps].every(Number.isFinite) ||
      accumulator < 0 || elapsedSeconds < 0 || step <= 0 || maxSteps < 1) {
    throw new RangeError('Invalid fixed-step arguments')
  }
  let pending = Math.min(accumulator + elapsedSeconds, step * maxSteps)
  let iterations = 0
  while (pending >= step && iterations < maxSteps) {
    update()
    pending -= step
    iterations += 1
  }
  return pending
}
