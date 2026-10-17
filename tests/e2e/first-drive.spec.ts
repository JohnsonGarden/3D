import { expect, test } from '@playwright/test'

test('first drive is discoverable and garage restores play', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('BRICK WORLD')).toBeVisible()
  await expect(page.getByLabel('驾驶操作说明')).toBeVisible()
  await expect(page.getByRole('button', { name: /打开车库/ })).toBeVisible()

  await page.getByRole('button', { name: /打开车库/ }).click()
  await expect(page.getByRole('dialog', { name: '我的车库' })).toBeVisible()
  await expect(page.getByText(/尚非照片重建/)).toBeVisible()
  await expect(page.getByLabel('导入 GLB 模型')).toHaveAttribute('type', 'file')
  await page.getByRole('button', { name: /开始驾驶/ }).click()
  await expect(page.getByRole('dialog', { name: '我的车库' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /重置车辆/ })).toBeVisible()
})

test('keyboard garage toggle, local music selector and invalid GLB handling', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('g')
  await expect(page.getByRole('dialog', { name: '我的车库' })).toBeVisible()
  await page.getByLabel('导入 GLB 模型').setInputFiles({
    name: 'not-a-model.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('invalid')
  })
  await expect(page.getByText('请选择不超过 20 MB 的 .glb 模型文件。')).toBeVisible()
  await page.getByRole('button', { name: '关闭车库' }).click()
  await expect(page.getByLabel('选择背景音乐')).toBeAttached()
  await expect(page.locator('audio')).toHaveCount(0)
})

test('real WebGL canvas drives forward and reset clears speed', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 })
  await page.keyboard.down('w')
  // Test observable motion, not merely static instructions or a mocked UI.
  await expect.poll(async () =>
    (await page.locator('.hud strong').innerText()).trim()
  , { timeout: 10_000 }).toMatch(/^[1-9][0-9]*\s*km\/h/)
  await page.keyboard.up('w')
  await page.screenshot({ path: 'test-results/first-drive-chromium.png', fullPage: true })
  await page.getByRole('button', { name: /重置车辆/ }).click()
  await expect(page.locator('.hud strong')).toContainText('0 km/h')
})

test('garage shows full truck calibration and explicit bumper exclusion', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /打开车库/ }).click()
  const info = page.getByLabel('等比例放大标定')
  for (const expected of ['80.65×', '8.39 m', '2.50 m', '3.79 m', '1.13 m', '不含前防撞栏']) {
    await expect(info).toContainText(expected)
  }
})

test('garage displays four axle intervals and front bumper total truck length', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /打开车库/ }).click()
  const calibration = page.getByLabel('等比例放大标定')
  for (const datum of ['总长（含前防撞梁）', '9.03 m', '前防撞梁向前突出', '0.65 m', '第一至第四轴轴距', '5.16 m', '2.58 / 1.29 / 1.29 m']) {
    await expect(calibration).toContainText(datum)
  }
})

test('Q and controller switch 8x4 to 8x8; three differential locks remain independent', async ({ page }) => {
  await page.goto('/')
  const drivetrain = page.getByRole('region', {name:'传动系统'})
  const mode = drivetrain.getByRole('button',{name:'切换驱动模式'})
  await expect(mode).toHaveAttribute('aria-pressed','false')
  await expect(drivetrain).toContainText('8×4 后双桥驱动')
  await page.keyboard.press('q')
  await expect(mode).toHaveAttribute('aria-pressed','true')
  await expect(drivetrain).toContainText('8×8 全轮驱动')
  await expect(drivetrain).toContainText('1 · 2 · 3 · 4')
  await mode.click()
  await expect(mode).toHaveAttribute('aria-pressed','false')
  await page.keyboard.press('1')
  const front = drivetrain.getByRole('button',{name:'差速锁：前桥组'})
  const rear = drivetrain.getByRole('button',{name:'差速锁：后桥组'})
  const center = drivetrain.getByRole('button',{name:'差速锁：中央'})
  await expect(front).toHaveAttribute('aria-pressed','true')
  await expect(rear).toHaveAttribute('aria-pressed','false')
  await expect(center).toHaveAttribute('aria-pressed','false')
  await rear.click()
  await center.click()
  for (const lock of [front,rear,center]) await expect(lock).toHaveAttribute('aria-pressed','true')
  await front.click()
  await expect(front).toHaveAttribute('aria-pressed','false')
  await expect(rear).toHaveAttribute('aria-pressed','true')
})

test('T low-grip surface demonstrates bounded gain and reset keeps selected drivetrain', async ({ page }) => {
  await page.goto('/')
  const panel = page.getByRole('region',{name:'传动系统'})
  const mode = panel.getByRole('button',{name:'切换驱动模式'})
  const surface = panel.getByRole('button',{name:'切换路面附着力'})
  await expect(panel).toContainText('100%')
  await page.keyboard.press('t')
  await expect(surface).toHaveAttribute('aria-pressed','true')
  await expect(panel).toContainText('42%')
  await page.keyboard.press('q')
  await expect(panel).toContainText('65%')
  await page.keyboard.press('3')
  await expect(panel).toContainText('72%')
  await page.getByRole('button',{name:/重置车辆/}).click()
  await expect(mode).toHaveAttribute('aria-pressed','true')
  await expect(panel.getByRole('button',{name:'差速锁：中央'})).toHaveAttribute('aria-pressed','true')
  await expect(panel).toContainText('72%')
  await page.getByRole('button',{name:/打开车库/}).click()
  await expect(page.getByRole('dialog',{name:'我的车库'})).toBeVisible()
  await expect(page.getByLabel('等比例放大标定')).toContainText('底盘离地')
  await expect(page.getByLabel('等比例放大标定')).toContainText('14 条')
})
