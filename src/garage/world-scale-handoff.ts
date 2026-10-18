import {createWheelLayoutHandoff} from './wheel-layout.ts'
type Layout=ReturnType<typeof createWheelLayoutHandoff>
export function createWorldScaleHandoff(a:Layout,w:string){
 const s=w.trim()
 if(!/^\d+(?:\.\d{1,2})?$/.test(s)||+s<.5||+s>4)throw new RangeError('游戏车宽无效')
 const v=createWheelLayoutHandoff(a.toyDimensionsCm,a.axleCentersFromBodyFrontCm.join(','),String(a.tireCount),String(a.tireDiameterCm??''))
 const t=v.toyDimensionsCm, targetBodyWidthM=+s
 const uniformToyToWorldFactor=targetBodyWidthM/(t.widthCm/100)
 const m=(x:number)=>x/100*uniformToyToWorldFactor
 const bodyDimensionsM={length:m(t.lengthCm),width:m(t.widthCm),height:m(t.heightCm)}
 const axleCentersFromBodyFrontM=v.axleCentersFromBodyFrontCm.map(m)
 const axleLocalZFromBodyCenterM=v.axleCentersFromBodyFrontCm.map(x=>m(x-t.lengthCm/2))
 const tireDiameterM=v.tireDiameterCm===null?null:m(v.tireDiameterCm)
 return {format:'brickworld-world-scale-handoff' as const,version:1,
 modelStatus:'not_scaled' as const,rigStatus:'not_rigged' as const,
 sourceToyDimensionsCm:t,sourceAxleCentersFromBodyFrontCm:v.axleCentersFromBodyFrontCm,
 tireCount:v.tireCount,targetBodyWidthM,uniformToyToWorldFactor,
 bodyDimensionsM,axleCentersFromBodyFrontM,axleLocalZFromBodyCenterM,tireDiameterM}
}
