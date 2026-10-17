import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'

const smallPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lOMAAAAASUVORK5CYII=', 'base64')
const upload=(name:string)=>({name,mimeType:'image/png',buffer:smallPng})

test('019 local decoded tiny photo warns about resolution; replacement/clear discard advice',async({page})=>{
 const writes:string[]=[]
 page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url())})
 await page.goto('/')
 await page.getByRole('button',{name:/打开车库/}).click()
 const panel=page.getByRole('dialog',{name:'我的车库'})
 const picker=panel.getByLabel('选择小车多角度照片')
 await picker.setInputFiles([upload('front.png')])
 await expect(panel.getByRole('status',{name:'照片画质：front.png'})).toContainText('分辨率过低',{timeout:12000})
 await picker.setInputFiles([upload('rear.png')])
 await expect(panel.getByRole('status',{name:'照片画质：front.png'})).toHaveCount(0)
 await expect(panel.getByRole('status',{name:'照片画质：rear.png'})).toContainText('分辨率过低',{timeout:12000})
 await panel.getByRole('button',{name:'清空已选照片'}).click()
 await expect(panel.getByRole('status',{name:'照片画质：rear.png'})).toHaveCount(0)
 expect(writes).toEqual([])
 await expect(panel.getByText('照片还不能自动生成 3D 模型',{exact:false})).toBeVisible()
})
