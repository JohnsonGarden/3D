import { test, expect } from '@playwright/test'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'

const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=', 'base64')
const file=(name:string)=>({name,mimeType:'image/png',buffer:png})

test('018 labels individual views, missing angles remain honest; JSON contains no pixels/URL',async({page})=>{
 const writes:string[]=[]
 page.on('request',request=>{if(['POST','PUT','PATCH'].includes(request.method()))writes.push(request.url())})
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const panel=page.getByRole('dialog',{name:'我的车库'})
 await panel.getByLabel('选择小车多角度照片').setInputFiles([file('f.png'),file('side.png')])
 await panel.getByLabel('照片角度：f.png').selectOption('front')
 await panel.getByLabel('照片角度：side.png').selectOption('left')
 await expect(panel.getByRole('status',{name:'照片拍摄覆盖度'})).toContainText('缺少：车尾、右侧、顶部、斜侧')
 await panel.getByLabel('实物车长（cm）').fill('12.5')
 await panel.getByLabel('实物车宽（cm）').fill('4')
 await panel.getByLabel('实物车高（cm）').fill('6')
 const downloaded=page.waitForEvent('download')
 await panel.getByRole('button',{name:'导出采集清单 JSON'}).click()
 const info=await downloaded
 expect(info.suggestedFilename()).toBe('brickworld-capture.json')
 const manifest=JSON.parse((await readFile(await info.path())).toString('utf8'))
 expect(manifest.photos.map((x:{view:string})=>x.view)).toEqual(['front','left'])
 expect(manifest.dimensionsCm).toEqual({lengthCm:12.5,widthCm:4,heightCm:6})
 expect(manifest.reconstructionStatus).toBe('not_generated')
 expect(JSON.stringify(manifest)).not.toContain('blob:')
 expect(writes).toEqual([])
 await expect(panel.getByText('照片还不能自动生成 3D 模型',{exact:false})).toBeVisible()
})

test('018 replacing photos resets angles; incomplete physical numbers block manifest',async({page})=>{
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const panel=page.getByRole('dialog',{name:'我的车库'})
 const picker=panel.getByLabel('选择小车多角度照片')
 await picker.setInputFiles([file('one.png')])
 await panel.getByLabel('照片角度：one.png').selectOption('top')
 await picker.setInputFiles([file('two.png')])
 await expect(panel.getByLabel('照片角度：two.png')).toHaveValue('unassigned')
 await panel.getByLabel('实物车长（cm）').fill('12')
 await panel.getByRole('button',{name:'导出采集清单 JSON'}).click()
 await expect(page.getByRole('alert')).toContainText('长宽高')
 await panel.getByRole('button',{name:'清空已选照片'}).click()
 await expect(panel.getByText('尚未选择照片')).toBeVisible()
 await expect(panel.getByRole('button',{name:'导出采集清单 JSON'})).toBeDisabled()
})
