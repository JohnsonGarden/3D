import {useState} from 'react'
import type {ToyDimensionsCm} from './capture-manifest.ts'
import {createWheelLayoutHandoff} from './wheel-layout.ts'
import {createWorldScaleHandoff} from './world-scale-handoff.ts'

export default function WorldScaleProposal({toy,positions,tireCount,diameter}:{
 toy:ToyDimensionsCm;positions:string;tireCount:string;diameter:string
}){
 const [width,setWidth]=useState('')
 const [error,setError]=useState('')
 const calculate=()=>createWorldScaleHandoff(
  createWheelLayoutHandoff(toy,positions,tireCount,diameter),width)
 let preview:ReturnType<typeof calculate>|null=null
 try{if(width.trim())preview=calculate()}catch{/* Invalid input never yields success. */}
 const save=()=>{
  let url:string|null=null
  try{
   const data=calculate()
   url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
   const a=document.createElement('a')
   a.href=url;a.download='brickworld-world-scale.json'
   document.body.appendChild(a)
   try{a.click()}finally{a.remove()}
   const later=url
   window.setTimeout(()=>URL.revokeObjectURL(later),2000)
   url=null;setError('')
  }catch(e){
   if(url)URL.revokeObjectURL(url)
   setError(e instanceof Error?e.message:'游戏尺寸无效')
  }
 }
 return <div>
  <label>建议游戏车宽（m，仅预览）
   <input aria-label="建议游戏车宽（m，仅预览）" type="number" min="0.5" max="4" step="0.01"
    value={width} onChange={e=>{setWidth(e.target.value);setError('')}}/>
  </label>
  {preview&&<p role="status">等比例尺寸：车身长 {preview.bodyDimensionsM.length.toFixed(2)} m，
   宽 {preview.bodyDimensionsM.width.toFixed(2)} m，
   高 {preview.bodyDimensionsM.height.toFixed(2)} m；车轴 {preview.axleCentersFromBodyFrontM.length} 根。</p>}
  <button type="button" onClick={save}>导出等比例游戏尺寸 JSON</button>
  {error&&<p role="alert">{error}</p>}
  <small>每辆车自行选择游戏车宽；仅导出手填数据与等比例计算结果。
   未改变 GLB、车库、碰撞体或驾驶物理，也未生成车轮绑定。</small>
 </div>
}
