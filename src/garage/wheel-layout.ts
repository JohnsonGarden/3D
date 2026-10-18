import type { ToyDimensionsCm } from './capture-manifest.ts'

/** Manual guardian measurements, not a detected wheel rig or vehicle physics. */
export function createWheelLayoutHandoff(
  toy: ToyDimensionsCm, offsetsText: string, tireCountText: string, diameterText: string
) {
  const dimensions=[toy.lengthCm,toy.widthCm,toy.heightCm]
  if(dimensions.some(v=>!Number.isFinite(v)||v<0.5||v>200)) {
    throw new RangeError('实物尺寸须在 0.5–200 cm 内')
  }
  const parts=offsetsText.split(/[,，]/).map(s=>s.trim())
  if(parts.length<1||parts.length>8||parts.some(s=>!/^(?:\d+)(?:\.\d{1,2})?$/.test(s))) {
    throw new RangeError('请输入 1–8 个车轴中心位置，用逗号分隔，最多两位小数')
  }
  const offsets=parts.map(Number)
  if(offsets.some((v,i)=>!Number.isFinite(v)||v>toy.lengthCm||
    (i>0 && v-offsets[i-1]<0.1-1e-9))) {
    throw new RangeError('车轴位置必须在车身长度内，并按车头至车尾严格递增（间距至少 0.1 cm）')
  }
  if(!/^\d+$/.test(tireCountText.trim())) throw new RangeError('轮胎总数须为整数')
  const tireCount=Number(tireCountText.trim())
  if(!Number.isSafeInteger(tireCount)||tireCount%2!==0||
    tireCount<2*offsets.length||tireCount>4*offsets.length) {
    throw new RangeError('轮胎总数须为偶数，每个车轴平均 2–4 条轮胎；不推断轮胎分配')
  }
  const diameter=diameterText.trim()
  if(diameter && !/^(?:\d+)(?:\.\d{1,2})?$/.test(diameter)) {
    throw new RangeError('轮胎直径请输入厘米数字，最多两位小数')
  }
  const tireDiameterCm=diameter?Number(diameter):null
  if(tireDiameterCm!==null && (!Number.isFinite(tireDiameterCm)||
    tireDiameterCm<0.1||tireDiameterCm>toy.heightCm)) {
    throw new RangeError('轮胎直径必须大于等于 0.1 cm 且不超过实物车高')
  }
  return {
    format:'brickworld-wheel-layout' as const,version:1 as const,
    provenance:'guardian_manual' as const,
    reconstructionStatus:'not_generated' as const,rigStatus:'not_rigged' as const,
    toyDimensionsCm:{lengthCm:toy.lengthCm,widthCm:toy.widthCm,heightCm:toy.heightCm},
    axleCentersFromBodyFrontCm:offsets,tireCount,tireDiameterCm
  }
}
