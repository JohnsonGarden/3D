import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluatePhotoCoverage, parseToyDimensions, createCaptureManifest, VIEW_OPTIONS } from './capture-manifest.ts'

const photos = [
  { name:'front.jpg', size:1024, type:'image/jpeg', view:'front' as const, url:'blob:secret1' },
  { name:'side.png', size:700, type:'image/png', view:'left' as const, url:'blob:secret2' }
]

test('018 no inferred angles: duplicate labels and unassigned never count as missing coverage',()=>{
  const s=evaluatePhotoCoverage([...photos,{...photos[0],name:'another.jpg',view:'front' as const}])
  assert.deepEqual(s.missing, ['rear','right','top','diagonal'])
  assert.equal(s.annotated,false)
  assert.ok(VIEW_OPTIONS.some(x=>x.value==='bottom'))
  assert.deepEqual(evaluatePhotoCoverage([]).missing,['front','rear','left','right','top','diagonal'])
})

test('018 diagonal plus five cardinal headings qualifies only annotated coverage',()=>{
  const list=['front','rear','left','right','top','front-right'].map((view,i)=>({
    name:'pic'+i+'.jpg',size:500,type:'image/jpeg',view
  }))
  const result=evaluatePhotoCoverage(list)
  assert.equal(result.annotated,true)
  assert.deepEqual(result.missing,[])
})

test('018 partial/nonfinite/negative measurements cannot become verified data',()=>{
  assert.equal(parseToyDimensions({length:'',width:'',height:''}),null)
  assert.throws(()=>parseToyDimensions({length:'12',width:'',height:'4'}),RangeError)
  assert.throws(()=>parseToyDimensions({length:'0',width:'2',height:'1'}),RangeError)
  assert.throws(()=>parseToyDimensions({length:'NaN',width:'2',height:'1'}),RangeError)
  assert.throws(()=>parseToyDimensions({length:'200.1',width:'2',height:'1'}),RangeError)
  assert.deepEqual(parseToyDimensions({length:'12.5',width:'4',height:'6.1'}), {lengthCm:12.5,widthCm:4,heightCm:6.1})
})

test('018 handoff JSON excludes preview URLs, pixels, arbitrary extra objects, EXIF and false readiness',()=>{
  const dimensions=parseToyDimensions({length:'12',width:'4',height:'6'})
  const value=createCaptureManifest(photos,dimensions)
  assert.equal(value.version,1)
  assert.equal(value.reconstructionStatus,'not_generated')
  assert.equal(value.photos.length,2)
  assert.deepEqual(value.dimensionsCm,dimensions)
  const json=JSON.stringify(value)
  assert.ok(!json.includes('blob:'))
  assert.ok(!json.includes('secret1'))
  assert.ok(!json.includes('data:image'))
  assert.ok(!json.includes('gps'))
  assert.ok(!json.includes('binary'))
  assert.equal(value.coverage.annotated,false)
})

test('018 malformed/unsupported viewpoint and rogue metadata rejected',()=>{
  assert.throws(()=>createCaptureManifest([{...photos[0],view:'gps' as never}],null),RangeError)
  assert.throws(()=>createCaptureManifest([{...photos[0],name:'unsafe\u0000.jpg'}],null),RangeError)
  assert.throws(()=>createCaptureManifest([{...photos[0],size:999999999}],null),RangeError)
})
