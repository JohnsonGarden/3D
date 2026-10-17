import { TRUCK_DIMENSIONS } from '../sim/truck-scale.ts'

/** Finite handcrafted *fictional* street corridor, no real-world map/GIS data. */
export const ROAD_WIDTH_M = TRUCK_DIMENSIONS.laneWidthM * 2
export const CROSSING_Z: readonly number[] = [-100, -260, -420]
const BUILDING_COLORS = ['#839bb5', '#b3a594', '#8ea6ab', '#a7ae98', '#c6a8a0'] as const
const MAIN_LENGTH_M = 760
const MAIN_CENTER_Z = -260
const CROSS_LENGTH_M = 240
const JUNCTION_CLEARANCE_M = ROAD_WIDTH_M / 2 + 2

export type CrossStreet = Readonly<{ z: number; width: number; length: number }>
export type BuildingLot = Readonly<{
  x: number; z: number; width: number; depth: number; height: number; color: string
}>
export type LaneMarking = Readonly<{ x: number; z: number; axis: 'x' | 'z' }>
export type Sidewalk = Readonly<{ x: number; z: number; length: number }>

export type StreetLayout = Readonly<{
  mainRoad: Readonly<{ x: number; z: number; width: number; length: number }>
  crossroads: CrossStreet[]
  buildings: BuildingLot[]
  markings: LaneMarking[]
  mainSidewalks: Sidewalk[]
}>

/** Pure layout — generated once on scene mount; no React state on animation frames. */
export function createStreetLayout(): StreetLayout {
  const mainRoad = {
    x: 0, z: MAIN_CENTER_Z, width: ROAD_WIDTH_M, length: MAIN_LENGTH_M
  }
  const crossroads = CROSSING_Z.map(z => ({ z, width: ROAD_WIDTH_M, length: CROSS_LENGTH_M }))
  const buildings: BuildingLot[] = []
  for (let index = 0; index < 20; index++) {
    const z = 20 - index * 27
    for (const side of [-1, 1]) {
      const width = 9
      const depth = 12
      if (CROSSING_Z.some(crossing => Math.abs(z - crossing) - depth / 2 <
          ROAD_WIDTH_M / 2 + 1)) continue
      const height = 6 + ((index * 11 + (side + 1) * 7) % 11) * 2.3
      buildings.push({
        x: side * (18 + (index % 3) * 10), z, height, width, depth,
        color: BUILDING_COLORS[(index + (side + 1)) % BUILDING_COLORS.length]
      })
    }
  }

  const markings: LaneMarking[] = []
  const lowerZ = MAIN_CENTER_Z - MAIN_LENGTH_M / 2
  const upperZ = MAIN_CENTER_Z + MAIN_LENGTH_M / 2
  for (let z = 30; z >= lowerZ; z -= 7.2) {
    if (z > upperZ || CROSSING_Z.some(crossing => Math.abs(z - crossing) < 6)) continue
    markings.push({ x: 0, z, axis: 'z' })
  }
  for (const z of CROSSING_Z) {
    for (let index = -15; index <= 15; index++) {
      const x = index * 7.2
      if (Math.abs(x) < 6) continue
      markings.push({ x, z, axis: 'x' })
    }
  }

  // Split the original continuous roadside kerbs so they never bridge a crossing.
  const mainSidewalks: Sidewalk[] = []
  let upper = upperZ
  for (const crossing of [...CROSSING_Z, lowerZ - JUNCTION_CLEARANCE_M]) {
    const lower = crossing === lowerZ - JUNCTION_CLEARANCE_M ?
      lowerZ : crossing + JUNCTION_CLEARANCE_M
    if (upper > lower) {
      for (const side of [-1, 1]) {
        mainSidewalks.push({
          x: side * (ROAD_WIDTH_M / 2 + 0.7), z: (upper + lower) / 2,
          length: upper - lower
        })
      }
    }
    upper = crossing - JUNCTION_CLEARANCE_M
  }

  return { mainRoad, crossroads, buildings, markings, mainSidewalks }
}
