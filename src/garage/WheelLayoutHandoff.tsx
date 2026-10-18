import { useState } from 'react'
import type { ToyDimensionsCm } from './capture-manifest.ts'
import { createWheelLayoutHandoff } from './wheel-layout.ts'
import WorldScaleProposal from './WorldScaleProposal.tsx'

export default function WheelLayoutHandoff({toy}:{toy:ToyDimensionsCm}) {
  const [positions,setPositions]=useState('')
  const [tireCount,setTireCount]=useState('')
  const [diameter,setDiameter]=useState('')
  const [error,setError]=useState('')
  const exportLayout=()=>{
    let url:string|null=null
    try {
      const data=createWheelLayoutHandoff(toy,positions,tireCount,diameter)
      url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
      const anchor=document.createElement('a')
      anchor.href=url
      anchor.download='brickworld-wheel-layout.json'
      document.body.appendChild(anchor)
      try { anchor.click() } finally { anchor.remove() }
      const toRevoke=url
      window.setTimeout(()=>URL.revokeObjectURL(toRevoke),2000)
      url=null
      setError('')
    } catch(cause) {
      if(url) URL.revokeObjectURL(url)
      setError(cause instanceof Error?cause.message:'轮组测量无效')
    }
  }
  return <section className="model-proportion-review" role="region" aria-label="手动轮组测量交接">
    <strong>④ 记录实物车轴位置（人工测量）</strong>
    <p>用尺子量每根车轴中心距车身最前端的距离（厘米），按从前到后填写。数据不会自动识别或修改 GLB。</p>
    <label style={{display:'block'}}>车轴中心距车身前端（cm）
      <input type="text" inputMode="decimal" aria-label="车轴中心距车身前端（cm）"
        placeholder="例如 2.4,5.6,7.2,8.8" value={positions}
        onChange={e=>{setPositions(e.target.value);setError('')}}/>
    </label>
    <label style={{display:'block'}}>轮胎总数
      <input type="number" min="2" max="32" step="2" aria-label="轮胎总数"
        value={tireCount} onChange={e=>{setTireCount(e.target.value);setError('')}}/>
    </label>
    <label style={{display:'block'}}>轮胎直径（cm，选填）
      <input type="number" min="0.1" max={toy.heightCm} step="0.1"
        aria-label="轮胎直径（cm，选填）" value={diameter}
        onChange={e=>{setDiameter(e.target.value);setError('')}}/>
    </label>
    <button type="button" onClick={exportLayout}>导出轮组测量 JSON</button>
    {error && <p role="alert">{error}</p>}
    <WorldScaleProposal toy={toy} positions={positions} tireCount={tireCount} diameter={diameter}/>
    <small>导出仅包含手填厘米数据，不含照片、文件名或模型字节。未知轮胎分配、转向和驱动轴不会猜测；当前导入 GLB 尚未绑定真实轮组物理。</small>
  </section>
}
