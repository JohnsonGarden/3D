import test from 'node:test'
import assert from 'node:assert/strict'
import { CITY_BUILDINGS } from '../world/city-layout.ts'
import { CROSSING_Z, ROAD_WIDTH_M } from '../world/street-layout.ts'
import { advanceVehicle, INITIAL_VEHICLE, VEHICLE } from './vehicle.ts'
import { intersectsScenery, resolveSceneryContact } from './contact.ts'

const forward = {throttle:1, steer:0, brake:false}

test('012 scene solids share one finite deterministic footprint list; spawned truck is clear', () => {
  assert.equal(CITY_BUILDINGS.length, 38, 'four lots withdrawn to keep fictional junctions clear')
  assert.ok(CITY_BUILDINGS.some(b=>b.id==='roadside-kiosk'))
  assert.ok(CITY_BUILDINGS.every(b=>[b.x,b.z,b.width,b.depth,b.height].every(Number.isFinite)))
  assert.equal(intersectsScenery(INITIAL_VEHICLE, CITY_BUILDINGS), false)
  for (const building of CITY_BUILDINGS) for (const z of CROSSING_Z) {
    assert.ok(Math.abs(building.z - z) - building.depth / 2 >= ROAD_WIDTH_M / 2 + 1,
      'solid buildings must leave crossing carriageways plus pedestrian clearance')
  }
})

test('012 -Z bumper extends forward and rotation is respected in overlap SAT', () => {
  const wall={id:'wall',x:0,z:-4.4,width:1,depth:0.2}
  const sample={...INITIAL_VEHICLE,x:0,z:0,heading:0,speed:0}
  assert.equal(intersectsScenery(sample,[wall]), true, 'physical forward bumper reaches -4.838m')
  assert.equal(intersectsScenery({...sample,heading:Math.PI/2},[wall]),false,'sideways heading changes footprint')
  const side={id:'side',x:4.4,z:0,width:0.2,depth:1}
  assert.equal(intersectsScenery({...sample,heading:Math.PI/2},[side]),true)
})

test('012 normal unobstructed driving returns identical existing transition', () => {
  let state={...INITIAL_VEHICLE}
  for(let i=0;i<120;i++) {
    const proposed=advanceVehicle(state,forward,1/60)
    const result=resolveSceneryContact(state,proposed,CITY_BUILDINGS)
    assert.equal(result.hit,false)
    assert.deepEqual(result.state,proposed)
    state=result.state
  }
})

test('012 high-speed sweep cannot tunnel through narrow barrier', () => {
  const obstacle={id:'barrier',x:0,z:-8,width:4,depth:0.05}
  const state={x:0,z:0,heading:0,speed:22}
  const next={...state,z:-12}
  const result=resolveSceneryContact(state,next,[obstacle])
  assert.equal(result.hit,true)
  assert.equal(result.state.speed,0)
  assert.ok(result.state.z > -4,'stops before truck bumper enters barrier')
  assert.equal(intersectsScenery(result.state,[obstacle]),false)
})

test('012 city kiosk contact stops forward motion and reversing exits without reset', () => {
  const kiosk=CITY_BUILDINGS.find(x=>x.id==='roadside-kiosk')!
  let state={x:kiosk.x,z:kiosk.z+12,heading:0,speed:9}
  let collision=false
  for(let i=0;i<120;i++){
    const out=resolveSceneryContact(state,advanceVehicle(state,forward,1/60),CITY_BUILDINGS)
    state=out.state
    collision ||=out.hit
    if(collision)break
  }
  assert.equal(collision,true)
  assert.equal(state.speed,0)
  assert.equal(intersectsScenery(state,[kiosk]),false)
  const before=state.z
  for(let i=0;i<30;i++){
    state=resolveSceneryContact(state,advanceVehicle(state,{...forward,throttle:-1},1/60),CITY_BUILDINGS).state
  }
  assert.ok(state.z>before,'reverse should take truck away from wall')
  assert.equal(intersectsScenery(state,[kiosk]),false)
  assert.equal(intersectsScenery(INITIAL_VEHICLE,CITY_BUILDINGS),false)
})

test('012 nonfinite footprint/trajectory is rejected, not injected into renderer', () => {
  assert.throws(()=>intersectsScenery({...INITIAL_VEHICLE,heading:Infinity},CITY_BUILDINGS), RangeError)
  assert.throws(()=>resolveSceneryContact(INITIAL_VEHICLE,{...INITIAL_VEHICLE,z:NaN},CITY_BUILDINGS),RangeError)
  assert.ok(VEHICLE.frontBumperProjection>0)
})
