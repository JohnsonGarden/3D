/** Parent measurements on 2026-10-17. Input lengths are centimeters. */
export type ToyTruckMeasurements = Readonly<{
  bodyLength: number; bodyWidth: number; cabHighestPoint: number;
  tireDiameter: number; frontBumperProjection: number | null
}>
export const TOY_TRUCK_CM: ToyTruckMeasurements = Object.freeze({
  bodyLength: 10.4, bodyWidth: 3.1, cabHighestPoint: 4.7,
  tireDiameter: 1.4, frontBumperProjection: null
})
export const TARGET_TRUCK_WIDTH_M = 2.5
export const LANE_WIDTH_M = 3.5
export function calibrateTruck(m: ToyTruckMeasurements, widthM: number) {
  if (![m.bodyLength, m.bodyWidth, m.cabHighestPoint, m.tireDiameter, widthM]
    .every(v => Number.isFinite(v) && v > 0)) {
    throw new RangeError('Truck measurements and target width must be finite and positive')
  }
  if (m.frontBumperProjection !== null &&
    (!Number.isFinite(m.frontBumperProjection) || m.frontBumperProjection < 0)) {
    throw new RangeError('Bumper dimension must be nonnegative or unknown')
  }
  const scaleFactor = widthM / (m.bodyWidth / 100)
  const meters = (v: number) => v / 100 * scaleFactor
  return Object.freeze({
    scaleFactor,
    bodyLengthM: meters(m.bodyLength),
    bodyWidthM: meters(m.bodyWidth),
    cabHighestPointM: meters(m.cabHighestPoint),
    tireDiameterM: meters(m.tireDiameter),
    frontBumperProjectionM: m.frontBumperProjection === null ? null : meters(m.frontBumperProjection),
    laneWidthM: LANE_WIDTH_M
  })
}
export const TRUCK_DIMENSIONS = calibrateTruck(TOY_TRUCK_CM, TARGET_TRUCK_WIDTH_M)

/** X=width, Y=height, Z=length. One scale factor; reject implausible geometry. */
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
