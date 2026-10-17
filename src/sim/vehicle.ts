import { TRUCK_DIMENSIONS } from './truck-scale.ts'
import { effectiveSteerAngle, INITIAL_DRIVETRAIN, tractionCoefficient } from './drivetrain.ts'
import type { DrivetrainState } from './drivetrain.ts'
/**
 * Game simulation is in SI units: meters, seconds, radians.
 * Forward = -Z at heading zero, X increases toward the right.
 * This simplified bicycle-style kinematic model is intentionally
 * NOT a rigid body or tire-force simulation.
 */
export interface VehicleState {
  x: number
  z: number
  heading: number
  speed: number
}

export interface DriverInput {
  throttle: number
  steer: number
  brake: boolean
}

export const INITIAL_VEHICLE: Readonly<VehicleState> = Object.freeze({
  x: TRUCK_DIMENSIONS.laneWidthM / 2, z: 0, heading: 0, speed: 0
})

export const VEHICLE = Object.freeze({
  length: TRUCK_DIMENSIONS.bodyLengthM,
  width: TRUCK_DIMENSIONS.bodyWidthM,
  height: TRUCK_DIMENSIONS.cabHighestPointM,
  wheelDiameter: TRUCK_DIMENSIONS.tireDiameterM,
  totalLength: TRUCK_DIMENSIONS.totalLengthWithBumperM,
  frontBumperProjection: TRUCK_DIMENSIONS.frontBumperProjectionM,
  wheelbase: TRUCK_DIMENSIONS.firstToFourthAxleM, // measured span, kinematic bicycle proxy (NOT 4-axle dynamics)
  maxForward: 22,
  maxReverse: 4,
  acceleration: 3.2,
  brakeDeceleration: 9,
  rollingResistance: 1.4,
  steeringRadians: 0.4,
  maxStep: 1 / 30,
  fixedStep: 1 / 60
})

const clamp = (value: number, lower: number, upper: number): number =>
  Math.max(lower, Math.min(upper, value))

const approach = (value: number, target: number, amount: number): number =>
  value < target ? Math.min(target, value + amount) : Math.max(target, value - amount)

/**
 * Deterministic one-step pure transition. Bad input never contaminates scene.
 * dt is capped; the game loop supplies fixed dt and handles accumulation.
 */
export function advanceVehicle(
  current: Readonly<VehicleState>,
  input: Readonly<DriverInput>,
  dt: number,
  drivetrain: Readonly<DrivetrainState> = INITIAL_DRIVETRAIN
): VehicleState {
  if (!Number.isFinite(dt) || dt < 0 ||
      !Object.values(current).every(Number.isFinite) ||
      !Number.isFinite(input.throttle) || !Number.isFinite(input.steer)) {
    throw new RangeError('Vehicle simulation requires finite state, controls and nonnegative dt')
  }
  const grip = tractionCoefficient(drivetrain)
  const elapsed = clamp(dt, 0, VEHICLE.maxStep)
  const throttle = clamp(input.throttle, -1, 1)
  const steer = clamp(input.steer, -1, 1)
  let speed = current.speed

  if (input.brake) {
    speed = approach(speed, 0, VEHICLE.brakeDeceleration * elapsed)
  } else {
    speed += throttle * VEHICLE.acceleration * grip * elapsed
    if (throttle === 0) {
      speed = approach(speed, 0, VEHICLE.rollingResistance * elapsed)
    }
  }
  speed = clamp(speed, -VEHICLE.maxReverse, VEHICLE.maxForward)
  // Kinematic bicycle approximation; steering has no effect while stationary.
  const heading = current.heading + speed / VEHICLE.wheelbase *
    Math.tan(effectiveSteerAngle(steer)) * (0.65 + 0.35 * grip) * elapsed

  return {
    x: current.x + Math.sin(heading) * speed * elapsed,
    z: current.z - Math.cos(heading) * speed * elapsed,
    heading,
    speed
  }
}

export function speedKmh(state: Readonly<VehicleState>): number {
  return Math.round(Math.abs(state.speed) * 3.6)
}
