import test from 'node:test'
import assert from 'node:assert/strict'
import { createWheelLayoutHandoff } from './wheel-layout.ts'
import { createWorldScaleHandoff } from './world-scale-handoff.ts'

const toy={lengthCm:10.4,widthCm:3.1,heightCm:4.7}
const wheel=createWheelLayoutHandoff(toy,'2.4,5.6,7.2,8.8','14','1.4')
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9)

test('023 derives body and four axle positions using one per-car factor',()=>{
 const out=createWorldScaleHandoff(wheel,'2.50')
 assert.equal(out.format,'brickworld-world-scale-handoff')
 assert.equal(out.modelStatus,'not_scaled')
 assert.equal(out.rigStatus,'not_rigged')
 close(out.uniformToyToWorldFactor,2.5/(3.1/100))
 close(out.bodyDimensionsM.length,10.4/3.1*2.5)
 close(out.bodyDimensionsM.width,2.5)
 close(out.bodyDimensionsM.height,4.7/3.1*2.5)
 close(out.axleCentersFromBodyFrontM[0],2.4/3.1*2.5)
 close(out.axleLocalZFromBodyCenterM[0],(2.4-5.2)/3.1*2.5)
 close(out.axleLocalZFromBodyCenterM[3],(8.8-5.2)/3.1*2.5)
 close(out.tireDiameterM!,1.4/3.1*2.5)
 assert.equal(out.tireCount,14)
 assert.deepEqual(out.sourceToyDimensionsCm,toy)
 assert.doesNotMatch(JSON.stringify(out),/filename|garageId|blob:|https?:|photo/i)
})

test('023 allows individual target widths and preserves unknown diameter',()=>{
 const a=createWorldScaleHandoff(wheel,'1.20')
 const b=createWorldScaleHandoff(wheel,'2.50')
 close(a.bodyDimensionsM.length/b.bodyDimensionsM.length,1.2/2.5)
 assert.equal(a.targetBodyWidthM,1.2)
 const unknown=createWheelLayoutHandoff(toy,'2.4,5.6','4','')
 assert.equal(createWorldScaleHandoff(unknown,'1.75').tireDiameterM,null)
})

test('023 rejects malformed width or source geometry',()=>{
 for(const width of ['','0','0.49','4.01','2e0','NaN','Infinity','-1','1.234','  ']){
  assert.throws(()=>createWorldScaleHandoff(wheel,width),RangeError)
 }
 assert.throws(()=>createWorldScaleHandoff({...wheel,axleCentersFromBodyFrontCm:[2.4,10.5]},'2.5'),RangeError)
 assert.throws(()=>createWorldScaleHandoff({...wheel,toyDimensionsCm:{...toy,widthCm:Infinity}},'2.5'),RangeError)
})
