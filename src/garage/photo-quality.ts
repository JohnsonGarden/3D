/**
 * 019 — lightweight, local decoded-pixel hints only. No AI inference, EXIF,
 * feature recognition, photo storage, network requests or backend.
 */
export type PhotoQualityStatus =
  'low-resolution' | 'too-dark' | 'too-bright' | 'low-detail' | 'ok' | 'unavailable'

export type PhotoQuality = Readonly<{
  status: PhotoQualityStatus
  meanBrightness: number
  edgeVariation: number
}>

export const QUALITY_HINT: Readonly<Record<PhotoQualityStatus,string>> = {
  'low-resolution': '分辨率过低，建议使用清晰原图重新拍摄。',
  'too-dark': '照片偏暗，建议增加均匀光线后重拍。',
  'too-bright': '照片过亮，建议降低曝光、避开强反光。',
  'low-detail': '画面细节或反差较少，请目测轮廓是否清楚。',
  'ok': '基础画质检查未发现明显问题；仍需人工检查清晰度和遮挡。',
  'unavailable': '画质检测不可用，请人工检查照片。'
}

/** Input is a temporary downsampled RGBA buffer: max 160x160 pixels. */
export function assessPhotoPixels(
  rgba: Uint8ClampedArray,
  sampledWidth: number,
  sampledHeight: number,
  originalWidth: number,
  originalHeight: number
): PhotoQuality {
  const values=[sampledWidth,sampledHeight,originalWidth,originalHeight]
  if (values.some(x=>!Number.isSafeInteger(x)||x<=0)||
      sampledWidth>160||sampledHeight>160||
      rgba.length!==sampledWidth*sampledHeight*4) {
    throw new RangeError('Invalid bounded photo pixel sample')
  }
  const n=sampledWidth*sampledHeight
  const gray=new Float32Array(n)
  let sum=0
  for(let i=0;i<n;i++) {
    const k=i*4
    const a=rgba[k+3]/255
    // A white canvas background ensures transparent PNG pixels do not
    // spuriously become underexposed when composited for display.
    const r=rgba[k]*a+255*(1-a)
    const g=rgba[k+1]*a+255*(1-a)
    const b=rgba[k+2]*a+255*(1-a)
    const v=0.2126*r+0.7152*g+0.0722*b
    gray[i]=v
    sum+=v
  }
  const meanBrightness=sum/n
  let variance=0,edges=0, edgeCount=0
  for(let y=0;y<sampledHeight;y++)for(let x=0;x<sampledWidth;x++) {
    const k=y*sampledWidth+x
    variance+=(gray[k]-meanBrightness)**2
    if(x>0) { edges+=Math.abs(gray[k]-gray[k-1]);edgeCount++ }
    if(y>0) { edges+=Math.abs(gray[k]-gray[k-sampledWidth]);edgeCount++ }
  }
  const deviation=Math.sqrt(variance/n)
  const edgeVariation=edgeCount?edges/edgeCount:0
  let status:PhotoQualityStatus='ok'
  if(originalWidth<640||originalHeight<480)status='low-resolution'
  else if(meanBrightness<32)status='too-dark'
  else if(meanBrightness>235)status='too-bright'
  else if(deviation<15||edgeVariation<6)status='low-detail'
  return {status,meanBrightness,edgeVariation}
}
