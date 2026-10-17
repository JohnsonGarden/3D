export type FrameMetrics = Readonly<{
  count: number
  medianFps: number
  p95Ms: number
}>

/**
 * Browser animation-frame interval diagnostics, not GPU timers.
 * Input is actual animation delta in seconds (not simulation's clamped dt).
 */
export class FrameMetricWindow {
  private readonly milliseconds: number[] = []
  readonly capacity: number
  readonly minimumSamples: number

  constructor(capacity = 300, minimumSamples = 30) {
    if (!Number.isInteger(capacity) || capacity < 1 ||
        !Number.isInteger(minimumSamples) ||
        minimumSamples < 1 || minimumSamples > capacity) {
      throw new RangeError('Invalid frame stats window configuration')
    }
    // Node 22 --experimental-strip-types does not support TS parameter properties.
    this.capacity = capacity
    this.minimumSamples = minimumSamples
  }

  record(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds)) return
    const ms = deltaSeconds * 1000
    // Filter background-tab stalls and sub-millisecond invalid frame intervals.
    if (ms < 1 || ms > 250) return
    this.milliseconds.push(ms)
    if (this.milliseconds.length > this.capacity) this.milliseconds.shift()
  }

  snapshot(): FrameMetrics | null {
    if (this.milliseconds.length < this.minimumSamples) return null
    const sorted = [...this.milliseconds].sort((a,b)=>a-b)
    const length = sorted.length
    const mid = Math.floor(length / 2)
    const medianMs = length % 2
      ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
    const p95Ms = sorted[Math.ceil(length * 0.95) - 1]
    return {
      count: length,
      medianFps: 1000 / medianMs,
      p95Ms
    }
  }

  clear(): void { this.milliseconds.length = 0 }
}
