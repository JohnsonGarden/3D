import test from 'node:test'
import assert from 'node:assert/strict'
import { TRUCK_DIMENSIONS } from '../sim/truck-scale.ts'
import { createStreetLayout, CROSSING_Z, ROAD_WIDTH_M } from './street-layout.ts'

test('013 fictional corridor has three 7m wide, 240m long crossroads', () => {
  const layout=createStreetLayout()
  assert.equal(ROAD_WIDTH_M,TRUCK_DIMENSIONS.laneWidthM*2)
  assert.deepEqual(CROSSING_Z,[-100,-260,-420])
  assert.equal(layout.crossroads.length,3)
  assert.deepEqual(layout.crossroads.map(road=>road.z),CROSSING_Z)
  for(const road of layout.crossroads) {
    assert.equal(road.width,ROAD_WIDTH_M)
    assert.equal(road.length,240)
  }
  assert.equal(layout.mainRoad.width,ROAD_WIDTH_M)
  assert.equal(layout.mainRoad.length,760)
})

test('013 building footprints avoid both main and cross street paving with buffer', () => {
  const layout=createStreetLayout()
  assert.ok(layout.buildings.length>20 && layout.buildings.length<=60)
  for (const building of layout.buildings) {
    assert.ok(Math.abs(building.x)-building.width/2>=ROAD_WIDTH_M/2+1)
    for(const z of CROSSING_Z)
      assert.ok(Math.abs(building.z-z)-building.depth/2>=ROAD_WIDTH_M/2+1)
  }
})

test('013 crossing pavements have no centerline dashes, sidewalk openings stay clear',()=>{
  const layout=createStreetLayout()
  assert.ok(layout.markings.length>50 && layout.markings.length<240)
  for(const mark of layout.markings) {
    if(mark.axis==='z') {
      for(const z of CROSSING_Z) assert.ok(Math.abs(mark.z-z)>=6)
    } else {
      assert.ok(Math.abs(mark.x)>=6)
    }
  }
  assert.equal(layout.mainSidewalks.length,8)
  for(const curb of layout.mainSidewalks) {
    for(const z of CROSSING_Z)
      assert.ok(Math.abs(curb.z-z)-curb.length/2>=ROAD_WIDTH_M/2+1)
  }
})

test('013 geometry is reproducible and numerically bounded',()=>{
  const layout=createStreetLayout()
  assert.deepEqual(createStreetLayout(),layout)
  const all=[layout.mainRoad,...layout.crossroads,...layout.buildings,...layout.markings,...layout.mainSidewalks]
  for(const value of all) for(const n of Object.values(value))
    if (typeof n==='number') assert.ok(Number.isFinite(n))
})
