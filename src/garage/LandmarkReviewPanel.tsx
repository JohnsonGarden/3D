import { useState } from 'react'
import { LANDMARK_CRITERIA, emptyLandmarkChecks, evaluateLandmarkReview } from './landmark-review.ts'
import type { LandmarkId } from './landmark-review.ts'

export default function LandmarkReviewPanel() {
  const [checks,setChecks]=useState(emptyLandmarkChecks)
  const [confirmed,setConfirmed]=useState(false)
  const result=evaluateLandmarkReview(checks,confirmed)
  const change=(id:LandmarkId,checked:boolean)=>{
    setChecks(previous=>({...previous,[id]:checked}))
    setConfirmed(false)
  }
  return <section className="model-proportion-review" role="region" aria-label="手动结构特征核对">
    <strong>③ 对照照片人工核对结构</strong>
    <p>请家长观察当前 GLB 与照片，逐项勾选能对应的特征；不会自动识别。</p>
    <fieldset>
      <legend>结构特征（至少 4/5）</legend>
      {LANDMARK_CRITERIA.map(item=><label key={item.id} style={{display:'block',margin:'10px 0'}}>
        <input type="checkbox" checked={checks[item.id]}
          onChange={event=>change(item.id,event.currentTarget.checked)}/>
        <b> {item.label}</b><small>{item.description}</small>
      </label>)}
    </fieldset>
    <p role="status">{result.confirmed
      ? `本次会话已人工核对 ${result.checkedCount}/5 项`
      : `已勾选 ${result.checkedCount}/5 项；${result.canConfirm?'可提交人工确认':'至少需 4 项一致'}`}</p>
    <button type="button" disabled={!result.canConfirm} onClick={()=>setConfirmed(true)}>
      确认本次人工结构核对
    </button>
    <small>本结果仅代表当前会话中的人工选择，不是照片自动重建或保真认证。
      更换车辆或照片将清空结果；不会上传、存储或修改模型。</small>
  </section>
}
