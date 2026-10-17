/**
 * Shared fictional scenery geometry: source of truth for visual solid meshes
 * AND deterministic arcade footprint collision. SI units, X/Z meters.
 * No map/GIS accuracy or original photo reconstruction implied.
 */
export type SceneryObstacle = Readonly<{
  id: string
  x: number
  z: number
  width: number
  depth: number
}>

export type CityBuilding = SceneryObstacle & Readonly<{
  height: number
  color: string
}>

const CITY_COLORS = ['#839bb5', '#b3a594', '#8ea6ab', '#a7ae98', '#c6a8a0']

function buildScenery(): readonly CityBuilding[] {
  const solids: CityBuilding[] = []
  for (let i = 0; i < 20; i++) {
    const z = 20 - i * 27
    for (const side of [-1, 1]) {
      const h = 6 + ((i * 11 + (side + 1) * 7) % 11) * 2.3
      solids.push(Object.freeze({
        id: 'city-' + i + '-' + side,
        x: side * (18 + (i % 3) * 10),
        z, width: 9, depth: 12, height: h,
        color: CITY_COLORS[(i + (side + 1)) % CITY_COLORS.length]
      }))
    }
  }
  // Original low roadside garage landmark.
  solids.push(Object.freeze({
    id: 'roadside-garage', x: 12.7, z: 14,
    width: 8.5, depth: 8, height: 3.6, color: '#d5d3c8'
  }))
  // Obvious small obstacle on the right shoulder, safely outside 7m paved road.
  solids.push(Object.freeze({
    id: 'roadside-kiosk', x: 12, z: -15,
    width: 4, depth: 6, height: 3.8, color: '#e2b35b'
  }))
  return Object.freeze(solids)
}

export const CITY_BUILDINGS = buildScenery()
