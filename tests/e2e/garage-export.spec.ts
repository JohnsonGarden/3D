import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { tinyTruckGlb } from './tiny-glb.fixture.ts'

test('010 explicit export downloads identical GLB, no HTTP uploads or garage mutations', async ({page}) => {
  const writes:string[] = []
  page.on('request', req => {
    if (['POST','PUT','PATCH'].includes(req.method())) writes.push(req.url())
  })
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  const original = tinyTruckGlb()
  await page.getByLabel('导入 GLB 模型').setInputFiles({
    name:'原创备份.glb',mimeType:'model/gltf-binary',buffer:original
  })
  await expect(page.getByRole('button',{name:'选择车辆：原创备份.glb'})).toBeVisible()
  const promise = page.waitForEvent('download')
  await page.getByRole('button',{name:'导出车辆：原创备份.glb'}).click()
  const download = await promise
  expect(download.suggestedFilename()).toBe('原创备份.glb')
  expect(await readFile(await download.path())).toEqual(original)
  await expect(page.getByLabel('已保存车辆')).toContainText('1/6 个保存位')
  await expect(page.getByLabel('驾驶信息')).toContainText('原创备份.glb')
  await page.reload()
  await expect(page.getByLabel('驾驶信息')).toContainText('原创备份.glb')
  expect(writes).toEqual([])
})

test('010 corrupted saved GLB refuses export, leaves the entry for recovery', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button',{name:/打开车库/}).click()
  await page.getByLabel('导入 GLB 模型').setInputFiles({
    name:'损坏后备份.glb',mimeType:'model/gltf-binary',buffer:tinyTruckGlb()
  })
  await expect(page.getByRole('button',{name:'导出车辆：损坏后备份.glb'})).toBeVisible()
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve,reject)=>{
      const r=indexedDB.open('brickworld-garage-v1')
      r.onsuccess=()=>resolve(r.result)
      r.onerror=()=>reject(r.error)
    })
    const records = await new Promise<Array<{id:string}>>((resolve,reject)=>{
      const r=db.transaction('vehicles','readonly').objectStore('vehicles').getAll()
      r.onsuccess=()=>resolve(r.result)
      r.onerror=()=>reject(r.error)
    })
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('blobs','readwrite')
      tx.objectStore('blobs').put(new ArrayBuffer(4),records[0].id)
      tx.oncomplete=()=>resolve()
      tx.onerror=()=>reject(tx.error)
    })
    db.close()
  })
  await page.getByRole('button',{name:'导出车辆：损坏后备份.glb'}).click()
  await expect(page.getByRole('alert')).toContainText('无法导出')
  await expect(page.getByRole('button',{name:'选择车辆：损坏后备份.glb'})).toBeVisible()
  await expect(page.getByRole('button',{name:'删除车辆：损坏后备份.glb'})).toBeEnabled()
})
