import type { ToyDimensionsCm } from './capture-manifest.ts'

/** 020: dimensionless, manual review of an unmodified GLB's axis-aligned bounds. */
export type ModelBounds = Readonly<{x:number;y:number;z:number}>
export type ModelProportionReview = Readonly<{
  toyLengthToWidth:number
  modelLengthToWidth:number
  toyHeightToWidth:number
  modelHeightToWidth:number
  lengthDifferencePct:number
  heightDifferencePct:number
  needsReview:boolean
}>

export function reviewModelProportions(
  toy:ToyDimensionsCm,
  bounds:ModelBounds
):ModelProportionReview {
  const values=[toy.lengthCm,toy.widthCm,toy.heightCm,bounds.x,bounds.y,bounds.z]
  if(values.some(v=>!Number.isFinite(v)||v<=0)) {
    throw new RangeError('Toy dimensions and GLB bounds must be positive and finite')
  }
  const toyLengthToWidth=toy.lengthCm/toy.widthCm
  const modelLengthToWidth=bounds.z/bounds.x
  const toyHeightToWidth=toy.heightCm/toy.widthCm
  const modelHeightToWidth=bounds.y/bounds.x
  const lengthDifferencePct=Math.abs(modelLengthToWidth/toyLengthToWidth-1)*100
  const heightDifferencePct=Math.abs(modelHeightToWidth/toyHeightToWidth-1)*100
  if(![toyLengthToWidth,modelLengthToWidth,toyHeightToWidth,modelHeightToWidth,
    lengthDifferencePct,heightDifferencePct].every(Number.isFinite)) {
    throw new RangeError('Ratio overflow')
  }
  return {
    toyLengthToWidth,modelLengthToWidth,toyHeightToWidth,modelHeightToWidth,
    lengthDifferencePct,heightDifferencePct,
    needsReview:lengthDifferencePct>10||heightDifferencePct>10
  }
}
