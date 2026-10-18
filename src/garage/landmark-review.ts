/** 021: guardian-operated checklist; never inferred from photo pixels or GLB geometry. */
export const LANDMARK_CRITERIA = [
  {id:'silhouette',label:'车头和车尾轮廓',description:'照片中的前后形状能在当前 GLB 中辨认'},
  {id:'body',label:'驾驶室和车身布局',description:'驾驶室、车厢或车身主体的位置关系一致'},
  {id:'wheels',label:'车轴与轮组位置',description:'轮组数量、轴位和大致间距能够对应'},
  {id:'roof',label:'顶部与侧面特征',description:'顶部高度变化和车身侧面形状可对应'},
  {id:'details',label:'独特积木细节',description:'保险杠、灯具或其他可见积木特征可对应'}
] as const

export type LandmarkId = typeof LANDMARK_CRITERIA[number]['id']
export type LandmarkChecks = Record<LandmarkId,boolean>

export function emptyLandmarkChecks():LandmarkChecks {
  return {silhouette:false,body:false,wheels:false,roof:false,details:false}
}

export function evaluateLandmarkReview(
  checks:Readonly<LandmarkChecks>, guardianConfirmed:boolean
):{checkedCount:number;canConfirm:boolean;confirmed:boolean} {
  const ids=LANDMARK_CRITERIA.map(item=>item.id)
  if(typeof guardianConfirmed!=='boolean' ||
    Object.keys(checks).length!==ids.length ||
    ids.some(id=>typeof checks[id]!=='boolean')) {
    throw new RangeError('Invalid manual landmark review state')
  }
  const checkedCount=ids.filter(id=>checks[id]).length
  const canConfirm=checkedCount>=4
  return {checkedCount,canConfirm,confirmed:canConfirm && guardianConfirmed}
}
