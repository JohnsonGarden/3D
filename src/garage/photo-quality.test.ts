import test from 'node:test'
import assert from 'node:assert/strict'
import { assessPhotoPixels } from './photo-quality.ts'

function constant(w:number,h:number,luminance:number) {
 const data=new Uint8ClampedArray(w*h*4)
 for(let i=0;i<data.length;i+=4) {data[i]=data[i+1]=data[i+2]=luminance;data[i+3]=255}
 return data
}

test('019 original resolution matters regardless of scaled sample dimensions',()=>{
 const result=assessPhotoPixels(constant(8,8,120),8,8,1,1)
 assert.equal(result.status,'low-resolution')
 assert.equal(assessPhotoPixels(constant(8,8,120),8,8,640,480).status,'low-detail')
})

test('019 extreme dark, bright and flat photo hints are distinct',()=>{
 assert.equal(assessPhotoPixels(constant(8,8,0),8,8,1200,800).status,'too-dark')
 assert.equal(assessPhotoPixels(constant(8,8,255),8,8,1200,800).status,'too-bright')
 assert.equal(assessPhotoPixels(constant(8,8,120),8,8,1200,800).status,'low-detail')
})

test('019 varied edges pass minimal heuristic, no claimed 3D success',()=>{
 const w=16,h=16, data=constant(w,h,100)
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const v=((x+y)%2)?50:210
  const i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=v
 }
 const result=assessPhotoPixels(data,w,h,1280,720)
 assert.equal(result.status,'ok')
 assert.ok(result.meanBrightness>0)
 assert.ok(result.edgeVariation>0)
})

test('019 bounds image sample and rejects malformed input without side effects',()=>{
 assert.throws(()=>assessPhotoPixels(constant(2,2,100),2,3,1200,800),RangeError)
 assert.throws(()=>assessPhotoPixels(constant(2,2,100),0,2,1200,800),RangeError)
 assert.throws(()=>assessPhotoPixels(constant(2,2,100),2,2,Infinity,800),RangeError)
 assert.throws(()=>assessPhotoPixels(constant(2,2,100),161,160,1200,800),RangeError)
})
