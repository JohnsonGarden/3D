import { validatePhotoSelection } from './photo-intake.ts'

export const VIEW_OPTIONS = [
  {value:'unassigned', label:'未标记'},
  {value:'front', label:'车头'},
  {value:'rear', label:'车尾'},
  {value:'left', label:'左侧'},
  {value:'right', label:'右侧'},
  {value:'front-left', label:'左前斜侧'},
  {value:'front-right', label:'右前斜侧'},
  {value:'rear-left', label:'左后斜侧'},
  {value:'rear-right', label:'右后斜侧'},
  {value:'top', label:'顶部'},
  {value:'bottom', label:'底部'}
] as const

export type PhotoView = typeof VIEW_OPTIONS[number]['value']
export type CapturePhoto = Readonly<{
  name: string
  size: number
  type: string
  view: PhotoView
}>
export type ToyDimensionFields = Readonly<{length:string; width:string; height:string}>
export type ToyDimensionsCm = Readonly<{lengthCm:number;widthCm:number;heightCm:number}>
export type MissingView = 'front'|'rear'|'left'|'right'|'top'|'diagonal'

const canonical: readonly MissingView[] = ['front','rear','left','right','top','diagonal']
const validViews = new Set<string>(VIEW_OPTIONS.map(x=>x.value))
const diagonalViews = new Set<string>(['front-left','front-right','rear-left','rear-right'])

function validateViews(photos: readonly CapturePhoto[]): void {
  for (const p of photos) {
    if (!validViews.has(p.view)) throw new RangeError('无效照片角度')
  }
}

export function evaluatePhotoCoverage(
  photos: readonly Readonly<{view: string}>[]
): {annotated:boolean;missing:MissingView[]} {
  const values = new Set(photos.map(x=>x.view))
  const missing = canonical.filter(x =>
    x === 'diagonal' ? ![...diagonalViews].some(view=>values.has(view)) : !values.has(x)
  )
  return {annotated:missing.length===0,missing}
}

/** Toy centimetres, NOT play-world metres. Empty all fields means unknown. */
export function parseToyDimensions(fields: ToyDimensionFields): ToyDimensionsCm | null {
  const strings = [fields.length.trim(),fields.width.trim(),fields.height.trim()]
  if (strings.every(x=>x==='')) return null
  if (strings.some(x=>x==='')) throw new RangeError('请填写完整实物车身长宽高，或三个字段全部留空。')
  const values = strings.map(x=>{
    if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(x)) {
      throw new RangeError('长宽高请输入 0.5–200 cm 之间的数字，最多两位小数。')
    }
    return Number(x)
  })
  if (values.some(x=>!Number.isFinite(x)||x<0.5||x>200)) {
    throw new RangeError('实物长宽高均须在 0.5–200 cm 之间。')
  }
  return {lengthCm:values[0],widthCm:values[1],heightCm:values[2]}
}

/** No File bytes, photos, blob URLs, EXIF or full File objects enter the payload. */
export function createCaptureManifest(
  photos: readonly CapturePhoto[],
  dimensionsCm: ToyDimensionsCm | null
) {
  validatePhotoSelection(photos)
  validateViews(photos)
  if (photos.some(x=>/[\u0000-\u001f\u007f]/.test(x.name))) {
    throw new RangeError('文件名包含无效字符')
  }
  if (dimensionsCm !== null) {
    const d=dimensionsCm
    if (![d.lengthCm,d.widthCm,d.heightCm].every(x=>Number.isFinite(x)&&x>=0.5&&x<=200)) {
      throw new RangeError('实物尺寸无效')
    }
  }
  const coverage=evaluatePhotoCoverage(photos)
  return {
    format:'brickworld-capture-manifest',
    version:1,
    reconstructionStatus:'not_generated',
    coverage,
    dimensionsCm:dimensionsCm
      ? {lengthCm:dimensionsCm.lengthCm,widthCm:dimensionsCm.widthCm,heightCm:dimensionsCm.heightCm}
      : null,
    photos:photos.map(({name,size,type,view})=>({name,size,type,view}))
  }
}
