import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Box3, Color, Group, MathUtils, Object3D, Vector3 } from 'three'
import { advanceVehicle, INITIAL_VEHICLE, VEHICLE, speedKmh } from '../sim/vehicle.ts'
import type { DriverInput, VehicleState } from '../sim/vehicle.ts'
import { tickFixed } from '../sim/fixed-step.ts'

type WorldProps = {
  controls: MutableRefObject<DriverInput>
  garageOpen: boolean
  resetCount: number
  model: Object3D | null
  onSpeed: (speed: number) => void
}

const CITY_COLORS = ['#839bb5', '#b3a594', '#8ea6ab', '#a7ae98', '#c6a8a0']

function BrickCar() {
  const studs = useMemo(() => {
    const list: [number, number][] = []
    for (let x = -2; x <= 2; x++) {
      for (let z = -4; z <= 4; z++) list.push([x * 0.32, z * 0.32])
    }
    return list
  }, [])

  return (
    <group>
      <mesh position={[0, 0.53, 0]} castShadow receiveShadow>
        <boxGeometry args={[VEHICLE.width, 0.56, VEHICLE.length]} />
        <meshStandardMaterial color="#e9a72b" metalness={0.08} roughness={0.39} />
      </mesh>
      <mesh position={[0, 1.05, 0.2]} castShadow>
        <boxGeometry args={[1.45, 0.58, 1.55]} />
        <meshStandardMaterial color="#f4c149" metalness={0.05} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.14, -0.6]} castShadow>
        <boxGeometry args={[1.47, 0.43, 0.38]} />
        <meshStandardMaterial color="#8aaabd" metalness={0.15} roughness={0.2} />
      </mesh>
      {studs.map(([x, z], index) => (
        <mesh key={index} position={[x, 0.83, z]} castShadow>
          <cylinderGeometry args={[0.105, 0.105, 0.09, 10]} />
          <meshStandardMaterial color="#f3b332" roughness={0.36} />
        </mesh>
      ))}
      {[-1, 1].flatMap((side) => [-1.2, 1.2].map((front) => (
        <mesh key={String(side) + ':' + String(front)}
          position={[side * 0.9, 0.43, front]}
          rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.24, 20]} />
          <meshStandardMaterial color="#242b38" roughness={0.72} />
        </mesh>
      )))}
      {[-0.52, 0.52].map(x => (
        <mesh key={x} position={[x, 0.59, -1.83]}>
          <boxGeometry args={[0.4, 0.17, 0.04]} />
          <meshStandardMaterial color="#fff2c6" emissive="#ffeab4" emissiveIntensity={0.16} />
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
    const scale = VEHICLE.length / Math.max(size.x, size.z, size.y)
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
        <planeGeometry args={[10.5, 760]} />
        <meshStandardMaterial color="#4c5767" roughness={0.96} />
      </mesh>
      {[-5.6, 5.6].map(x => (
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

function DrivingScene({ controls, garageOpen, resetCount, model, onSpeed }: WorldProps) {
  const car = useRef<Group>(null)
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
          vehicle.current = advanceVehicle(vehicle.current, controls.current, VEHICLE.fixedStep)
        }
      )
    } else {
      accumulated.current = 0
    }
    const s = vehicle.current
    if (car.current) {
      car.current.position.set(s.x, 0, s.z)
      car.current.rotation.y = s.heading
    }
    targetPos.current.set(
      s.x - Math.sin(s.heading) * 7.5,
      4.7,
      s.z + Math.cos(s.heading) * 7.5
    )
    camera.position.lerp(targetPos.current, 1 - Math.exp(-4.5 * dt))
    lookAtPos.current.set(s.x, 1.2, s.z - 2.7)
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
      <group ref={car}>{model ? <ImportedCar model={model} /> : <BrickCar />}</group>
    </>
  )
}

export default function World(props: WorldProps) {
  return (
    <Canvas
      aria-label="可驾驶的 3D 积木世界"
      camera={{ position: [0, 5, 9], fov: 60, near: 0.1, far: 550 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <DrivingScene {...props} />
    </Canvas>
  )
}
