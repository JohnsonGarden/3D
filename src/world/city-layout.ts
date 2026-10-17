/**
 * Shared fictional scenery geometry: source of truth for visual solid meshes
 * AND deterministic arcade footprint collision. SI units, X/Z meters.
 * No map/GIS accuracy or original photo reconstruction implied.
 */
import { createStreetLayout } from './street-layout.ts'

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

function buildScenery(): readonly CityBuilding[] {
  // Buildings are derived from the same *fictional* street layout used for
  // road rendering. Skip lots that intrude on a new junction, while retaining
  // distinct original roadside solid landmarks below.
  const solids: CityBuilding[] = createStreetLayout().buildings.map((lot, index) =>
    Object.freeze({ id: 'city-' + index, ...lot })
  )
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
