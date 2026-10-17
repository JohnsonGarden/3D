/**
 * Fictional first-drive itinerary, not LA geography.
 * One visible checkpoint per location on the current 7m straight road.
 */
export type Checkpoint = Readonly<{
  id: string
  label: string
  x: number
  z: number
  radius: number
  color: string
}>

export const ROAD_TRIP: readonly Checkpoint[] = Object.freeze([
  Object.freeze({id:'gate-1',label:'城市出发',x:1.75,z:-42,radius:3,color:'#ffd66d'}),
  Object.freeze({id:'gate-2',label:'彩色街区',x:1.75,z:-105,radius:3,color:'#68dbd2'}),
  Object.freeze({id:'gate-3',label:'远方驿站',x:1.75,z:-190,radius:3,color:'#f5a8ce'})
])

type Point = Readonly<{ x: number; z: number }>

export function upcomingCheckpoint(completed: number): Checkpoint | null {
  if (!Number.isInteger(completed) || completed < 0 || completed > ROAD_TRIP.length) {
    throw new RangeError('Invalid road trip progress')
  }
  return ROAD_TRIP[completed] ?? null
}

function segmentWithinRadius(start: Point, end: Point, point: Point, radius: number): boolean {
  const dx = end.x - start.x
  const dz = end.z - start.z
  const lengthSquared = dx * dx + dz * dz
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.z - start.z) * dz) / lengthSquared
  ))
  const px = start.x + dx * t
  const pz = start.z + dz * t
  return (px-point.x)**2 + (pz-point.z)**2 <= radius**2
}

/** An accepted gate can only advance, never disappear or get awarded twice. */
export function advanceCheckpoints(start: Point, end: Point, completed: number): number {
  if (![start.x,start.z,end.x,end.z].every(Number.isFinite) ||
      !Number.isInteger(completed) || completed < 0 || completed > ROAD_TRIP.length) {
    throw new RangeError('Invalid checkpoint segment or progress')
  }
  let next = completed
  while (next < ROAD_TRIP.length) {
    const gate = ROAD_TRIP[next]
    if (!segmentWithinRadius(start,end,gate,gate.radius)) break
    next++
  }
  return next
}
