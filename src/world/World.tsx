import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Box3, Group, Object3D, Vector3 } from 'three'
import { scaleImportedModelByWidth, TRUCK_DIMENSIONS } from '../sim/truck-scale.ts'
import { advanceVehicle, INITIAL_VEHICLE, VEHICLE, speedKmh } from '../sim/vehicle.ts'
import type { DriverInput, VehicleState } from '../sim/vehicle.ts'
import { tickFixed } from '../sim/fixed-step.ts'
import { axleSteerAngles } from '../sim/drivetrain.ts'
import type { DrivetrainState } from '../sim/drivetrain.ts'

type WorldProps = {
  controls: MutableRefObject<DriverInput>
  drivetrain: MutableRefObject<DrivetrainState>
  garageOpen: boolean
  resetCount: number
  model: Object3D | null
  onSpeed: (speed: number) => void
}

const CITY_COLORS = ['#839bb5', '#b3a594', '#8ea6ab', '#a7ae98', '#c6a8a0']

function BrickCar({ wheelStations }: { wheelStations: MutableRefObject<Record<string, Group | null>> }) {
  // Procedural sample only — not reconstructed from the six HEIC images.
  // Axle stations are measured. Twin tires are now shown, but no force solver exists.
  const radius = VEHICLE.wheelDiameter / 2
  const halfLength = VEHICLE.length / 2
  const cabRoof = VEHICLE.height - 0.12

  return (
    <group>
      <mesh position={[0, 0.99, 0]} castShadow receiveShadow>
        <boxGeometry args={[VEHICLE.width, 0.82, VEHICLE.length]} />
        <meshStandardMaterial color="#e9a72b" metalness={0.07} roughness={0.39} />
      </mesh>
      <mesh position={[0, 2.36, 1.55]} castShadow>
        <boxGeometry args={[VEHICLE.width * 0.96, 1.88, 5.18]} />
        <meshStandardMaterial color="#f5c14a" roughness={0.38} />
      </mesh>
      <mesh position={[0, (cabRoof + 1.36) / 2, -2.44]} castShadow>
        <boxGeometry args={[VEHICLE.width, cabRoof - 1.36, 3.4]} />
        <meshStandardMaterial color="#e5a52f" metalness={0.07} roughness={0.34} />
      </mesh>
      <mesh position={[0, 2.7, -halfLength + 0.026]}>
        <boxGeometry args={[VEHICLE.width * 0.84, 0.75, 0.045]} />
        <meshStandardMaterial color="#7494aa" metalness={0.13} roughness={0.22} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={'window' + side}
          position={[side * (VEHICLE.width / 2 + 0.003), 2.71, -2.66]}>
          <boxGeometry args={[0.012, 0.72, 1.2]} />
          <meshStandardMaterial color="#84a8b7" roughness={0.2} />
        </mesh>
      ))}
      {[-3.5, -2.8, -2.1, -1.4].flatMap(z =>
        [-0.8, 0, 0.8].map(x => (
          <mesh key={'cab-stud-' + x + '-' + z}
            position={[x, VEHICLE.height - 0.06, z]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 12]} />
            <meshStandardMaterial color="#f5b539" roughness={0.42} />
          </mesh>
        ))
      )}
      {[-0.5, 0.2, 0.9, 1.6, 2.3, 3, 3.7].flatMap(z =>
        [-0.8, 0, 0.8].map(x => (
          <mesh key={'rear-stud-' + x + '-' + z}
            position={[x, 3.38, z]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.15, 12]} />
            <meshStandardMaterial color="#f5c34c" roughness={0.42} />
          </mesh>
        ))
      )}
      {/* Real measured axle stations. A1 single each side; A2–A4 twin each side: 14 tires. */}
      {[-1, 1].flatMap(side => TRUCK_DIMENSIONS.axleLocalZFromBodyCenterM.map((axleZ, index) => (
        <group key={'axle-station-' + side + '-' + index}
          ref={node => { wheelStations.current[side + ':' + index] = node }}
          position={[side * (VEHICLE.width / 2 - 0.28), radius, axleZ]}>
          {(index === 0 ? [0.13] : [0.13, -0.16]).map((xOffset, tireIndex) => (
            <mesh key={'tire-' + tireIndex}
              position={[side * xOffset, 0, 0]}
              rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[radius, radius, 0.27, 24]} />
              <meshStandardMaterial color="#232b37" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )))}
      {/* Measured forward bumper extension; bumper HEIGHT remains artistic. */}
      <mesh position={[0, 0.99, -halfLength - TRUCK_DIMENSIONS.frontBumperProjectionM / 2]} castShadow>
        <boxGeometry args={[VEHICLE.width * 0.95, 0.28, TRUCK_DIMENSIONS.frontBumperProjectionM]} />
        <meshStandardMaterial color="#b9bcb5" metalness={0.58} roughness={0.41} />
      </mesh>
      {[-0.8, 0.8].map(x => (
        <mesh key={'headlamp' + x} position={[x, 1.02, -halfLength - 0.01]}>
          <boxGeometry args={[0.45, 0.2, 0.018]} />
          <meshStandardMaterial color="#fff3cf" emissive="#ffe6b0" emissiveIntensity={0.18} />
        </mesh>
      ))}
    </group>
  )
}

function ImportedCar({ model }: { model: Object3D }) {
  const transform = useMemo(() => {
    const bounds = new Box3().setFromObject(model)
    const size = bounds.getSize(new Vector3())
    if (bounds.isEmpty() || Math.max(size.x, size.y, size.z) <= 0) {
      return { scale: 1, center: [0, 0, 0] as [number, number, number] }
    }
    const scale = scaleImportedModelByWidth(size).scaleFactor
    const center = bounds.getCenter(new Vector3())
    return {
      scale,
      center: [-center.x, -bounds.min.y, -center.z] as [number, number, number]
    }
  }, [model])
  return (
    <group scale={transform.scale}>
      <group position={transform.center}><primitive object={model} /></group>
    </group>
  )
}

function RoadsAndBuildings() {
  const buildings = useMemo(() => {
    const result: { x: number, z: number, h: number, color: string }[] = []
    for (let i = 0; i < 20; i++) {
      const z = 20 - i * 27
      for (const side of [-1, 1]) {
        const h = 6 + ((i * 11 + (side + 1) * 7) % 11) * 2.3
        result.push({ x: side * (18 + (i % 3) * 10), z,
          h, color: CITY_COLORS[(i + (side + 1)) % CITY_COLORS.length] })
      }
    }
    return result
  }, [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -200]} receiveShadow>
        <planeGeometry args={[1250, 1250]} />
        <meshStandardMaterial color="#839b71" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -260]} receiveShadow>
        <planeGeometry args={[7, 760]} />
        <meshStandardMaterial color="#4c5767" roughness={0.96} />
      </mesh>
      {[-4.2, 4.2].map(x => (
        <mesh key={x} position={[x, 0.08, -250]} receiveShadow>
          <boxGeometry args={[1.6, 0.16, 780]} />
          <meshStandardMaterial color="#b4b3a3" roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: 105 }, (_, i) => (
        <mesh key={i} position={[0, 0.06, 30 - i * 7.2]}>
          <boxGeometry args={[0.13, 0.015, 3.2]} />
          <meshBasicMaterial color="#efdbc0" />
        </mesh>
      ))}
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 0.02, b.z]} castShadow receiveShadow>
          <boxGeometry args={[9, b.h, 12]} />
          <meshStandardMaterial color={b.color} roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[12.7, 1.8, 14]} castShadow>
        <boxGeometry args={[8.5, 3.6, 8]} />
        <meshStandardMaterial color="#d5d3c8" roughness={0.85} />
      </mesh>
      <mesh position={[8.4, 1.8, 14.2]}>
        <boxGeometry args={[0.12, 2.8, 5.4]} />
        <meshStandardMaterial color="#364959" />
      </mesh>
    </group>
  )
}

function DrivingScene({ controls, drivetrain, garageOpen, resetCount, model, onSpeed }: WorldProps) {
  const car = useRef<Group>(null)
  const wheelStations = useRef<Record<string, Group | null>>({})
  const vehicle = useRef<VehicleState>({ ...INITIAL_VEHICLE })
  const accumulated = useRef(0)
  const hudClock = useRef(0)
  const targetPos = useRef(new Vector3())
  const lookAtPos = useRef(new Vector3())
  const { camera } = useThree()

  useEffect(() => {
    vehicle.current = { ...INITIAL_VEHICLE }
    accumulated.current = 0
    onSpeed(0)
  }, [resetCount, onSpeed])

  useFrame((_, rawDt) => {
    const dt = Math.min(Math.max(rawDt, 0), 0.12)
    if (!garageOpen) {
      accumulated.current = tickFixed(
        accumulated.current, dt, VEHICLE.fixedStep, 6,
        () => {
          vehicle.current = advanceVehicle(vehicle.current, controls.current, VEHICLE.fixedStep, drivetrain.current)
        }
      )
    } else {
      accumulated.current = 0
    }
    const s = vehicle.current
    if (car.current) {
      car.current.position.set(s.x, 0, s.z)
      // Three.js +Y yaw rotates -Z toward -X. Simulation positive heading goes +X.
      car.current.rotation.y = -s.heading
    }
    const frontAngles = axleSteerAngles(garageOpen ? 0 : controls.current.steer)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const station = wheelStations.current[side + ':' + i]
        if (station) station.rotation.y = -frontAngles[i]
      }
    }
    targetPos.current.set(
      s.x - Math.sin(s.heading) * 16.5 + Math.cos(s.heading) * 5.5,
      9,
      s.z + Math.cos(s.heading) * 16.5 + Math.sin(s.heading) * 5.5
    )
    camera.position.lerp(targetPos.current, 1 - Math.exp(-4.5 * dt))
    lookAtPos.current.set(s.x, 2.25, s.z - 4.2)
    camera.lookAt(lookAtPos.current)
    hudClock.current += dt
    if (hudClock.current > 0.25) {
      hudClock.current = 0
      onSpeed(speedKmh(s))
    }
  })

  return (
    <>
      <color attach="background" args={['#a9c8da']} />
      <fog attach="fog" args={['#a9c8da', 100, 400]} />
      <hemisphereLight args={['#f9efe4', '#586751', 2.5]} />
      <directionalLight position={[16, 28, 18]} intensity={2.1} />
      <RoadsAndBuildings />
      <group ref={car}>{model ? <ImportedCar model={model} /> : <BrickCar wheelStations={wheelStations} />}</group>
    </>
  )
}

export default function World(props: WorldProps) {
  return (
    <Canvas
      aria-label="可驾驶的 3D 积木世界"
      camera={{ position: [7.25, 9, 17], fov: 60, near: 0.1, far: 550 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <DrivingScene {...props} />
    </Canvas>
  )
}
