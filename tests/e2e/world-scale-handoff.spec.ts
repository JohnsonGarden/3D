import {expect,test} from '@playwright/test'
import {tinyTruckGlb} from './tiny-glb.fixture.ts'

test('023 world scale handoff is local and session-only',async({page})=>{
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const g=page.getByRole('dialog',{name:'我的车库'})
 await g.getByLabel('选择小车多角度照片').setInputFiles({
  name:'a.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=','base64')})
 await g.getByLabel('导入 GLB 模型').setInputFiles({
  name:'test.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()})
 await g.getByLabel('实物车长（cm）').fill('10.4')
 await g.getByLabel('实物车宽（cm）').fill('3.1')
 await g.getByLabel('实物车高（cm）').fill('4.7')
 const p=g.getByRole('region',{name:'手动轮组测量交接'})
 await p.getByLabel('车轴中心距车身前端（cm）').fill('2.4,5.6,7.2,8.8')
 await p.getByLabel('轮胎总数').fill('14')
 await p.getByLabel('建议游戏车宽（m，仅预览）').fill('2.5')
 await expect(p.getByRole('status')).toContainText('8.39 m')
 const download=page.waitForEvent('download')
 await p.getByRole('button',{name:'导出等比例游戏尺寸 JSON'}).click()
 expect((await download).suggestedFilename()).toBe('brickworld-world-scale.json')
 await g.getByRole('button',{name:'清空已选照片'}).click()
 await expect(p).toHaveCount(0)
})
