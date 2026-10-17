/** Measurements provided by parent on 2026-10-17; physical input units are cm. */
export type ToyTruckMeasurements = Readonly<{
  bodyLength: number
  bodyWidth: number
  cabHighestPoint: number
  tireDiameter: number
  frontBumperProjection: number
  /** Front face of body (EXCLUDING bumper) to axle 1 centerline. */
  frontAxleOffset: number
  /** Axle centerline separations: 1->2, 2->3, 3->4. */
  axleSpacing: readonly [number, number, number]
  /** Axle 4 centerline to back face of body. */
  rearAxleOffset: number
}>
export const TOY_TRUCK_CM: ToyTruckMeasurements = Object.freeze({
  bodyLength: 10.4,
  bodyWidth: 3.1,
  cabHighestPoint: 4.7,
  tireDiameter: 1.4,
  frontBumperProjection: 0.8,
  frontAxleOffset: 2.4,
  axleSpacing: Object.freeze([3.2, 1.6, 1.6] as const),
  rearAxleOffset: 1.6
})
export const TARGET_TRUCK_WIDTH_M = 2.5
export const LANE_WIDTH_M = 3.5

/** One scalar for every dimension: a toy cm dimension / 100 * world-to-toy factor. */
export function calibrateTruck(m: ToyTruckMeasurements, widthM: number) {
  const positive = [
    m.bodyLength, m.bodyWidth, m.cabHighestPoint, m.tireDiameter,
    m.frontAxleOffset, ...m.axleSpacing, widthM
  ]
  if (!positive.every(v => Number.isFinite(v) && v > 0) ||
      ![m.frontBumperProjection, m.rearAxleOffset].every(v => Number.isFinite(v) && v >= 0)) {
    throw new RangeError('All measurements must be finite, and physical lengths must be valid')
  }
  const sumCm = m.frontAxleOffset +
    m.axleSpacing.reduce((sum, gap) => sum + gap, 0) + m.rearAxleOffset
  // Source measures are to one decimal cm. Flag a discrepancy beyond half a mm.
  if (Math.abs(sumCm - m.bodyLength) > 0.05) {
    throw new RangeError('Measured axle offsets do not close against measured body length')
  }
  const scaleFactor = widthM / (m.bodyWidth / 100)
  const meters = (v: number) => v / 100 * scaleFactor
  const axleFromFrontCm = [
    m.frontAxleOffset,
    m.frontAxleOffset + m.axleSpacing[0],
    m.frontAxleOffset + m.axleSpacing[0] + m.axleSpacing[1],
    m.frontAxleOffset + m.axleSpacing[0] + m.axleSpacing[1] + m.axleSpacing[2]
  ] as const
  // Body center at z=0, negative z is forward and front body face is -length/2.
  const axleLocalZCm = axleFromFrontCm.map(v => v - m.bodyLength / 2)
  return Object.freeze({
    scaleFactor,
    bodyLengthM: meters(m.bodyLength),
    bodyWidthM: meters(m.bodyWidth),
    cabHighestPointM: meters(m.cabHighestPoint),
    tireDiameterM: meters(m.tireDiameter),
    frontBumperProjectionM: meters(m.frontBumperProjection),
    totalLengthWithBumperM: meters(m.bodyLength + m.frontBumperProjection),
    frontAxleOffsetM: meters(m.frontAxleOffset),
    rearAxleOffsetM: meters(m.rearAxleOffset),
    axleSpacingM: Object.freeze(m.axleSpacing.map(meters)),
    axleFromFrontM: Object.freeze(axleFromFrontCm.map(meters)),
    axleLocalZFromBodyCenterM: Object.freeze(axleLocalZCm.map(meters)),
    firstToFourthAxleM: meters(m.axleSpacing.reduce((a, b) => a + b, 0)),
    laneWidthM: LANE_WIDTH_M
  })
}
export const TRUCK_DIMENSIONS = calibrateTruck(TOY_TRUCK_CM, TARGET_TRUCK_WIDTH_M)

/** X=width, Y=height, Z=length. Single scale factor; no anisotropic distortion. */
export function scaleImportedModelByWidth(size: Readonly<{ x: number; y: number; z: number }>) {
  if (![size.x, size.y, size.z].every(v => Number.isFinite(v) && v > 0)) {
    throw new RangeError('Imported model bounding size must be finite and positive')
  }
  const scaleFactor = TARGET_TRUCK_WIDTH_M / size.x
  const worldWidthM = size.x * scaleFactor
  const worldHeightM = size.y * scaleFactor
  const worldLengthM = size.z * scaleFactor
  if (worldLengthM < 1 || worldLengthM > 25 || worldHeightM < .1 || worldHeightM > 12) {
    throw new RangeError('Imported model proportions are not plausible for a truck')
  }
  return { scaleFactor, worldWidthM, worldHeightM, worldLengthM }
}
