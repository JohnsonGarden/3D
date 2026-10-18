import test from 'node:test'
import assert from 'node:assert/strict'
import { createWheelLayoutHandoff } from './wheel-layout.ts'

const toy={lengthCm:10.4,widthCm:3.1,heightCm:4.7}

test('022 measured axle stations and fourteen tires export only declared facts',()=>{
  const out=createWheelLayoutHandoff(toy,'2.4,5.6,7.2,8.8','14','1.4')
  assert.deepEqual(out,{
    format:'brickworld-wheel-layout',version:1,provenance:'guardian_manual',
    reconstructionStatus:'not_generated',rigStatus:'not_rigged',
    toyDimensionsCm:toy,
    axleCentersFromBodyFrontCm:[2.4,5.6,7.2,8.8],
    tireCount:14,tireDiameterCm:1.4
  })
  assert.equal(Object.keys(out).length,8)
  assert.doesNotMatch(JSON.stringify(out),/blob:|data:|https?:|filename|modelName|garageId|photo/i)
})

test('022 optional diameter is unknown, never invented',()=>{
  const out=createWheelLayoutHandoff(toy,'2.4，5.6','4','')
  assert.deepEqual(out.axleCentersFromBodyFrontCm,[2.4,5.6])
  assert.equal(out.tireDiameterCm,null)
})

test('022 rejects invalid or implausible layout',()=>{
  const invalid=[
    ['', '14','1.4'],['0,0','4',''],['1,0.9','4',''],
    ['1,1.05','4',''],['2,12','4',''],['-1,2','4',''],
    ['2e0,3','4',''],['1,2,3,4,5,6,7,8,9','18',''],
    ['1,2','3',''],['1,2','2',''],['1,2','10',''],
    ['1,2','4','0'],['1,2','4','10'],['1,2','4','no']
  ]
  for(const [positions,tires,diameter] of invalid){
    assert.throws(()=>createWheelLayoutHandoff(toy,positions,tires,diameter),RangeError)
  }
  assert.throws(()=>createWheelLayoutHandoff({...toy,lengthCm:Infinity},'1,2','4',''),RangeError)
})
