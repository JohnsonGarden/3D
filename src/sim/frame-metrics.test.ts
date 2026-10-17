import test from 'node:test'
import assert from 'node:assert/strict'
import { FrameMetricWindow } from './frame-metrics.ts'

test('013 stable 60Hz has 60FPS median and p95 near 16.67ms', () => {
  const window=new FrameMetricWindow(300,30)
  for(let i=0;i<120;i++)window.record(1/60)
  const stats=window.snapshot()
  assert.ok(stats)
  assert.equal(stats.count,120)
  assert.ok(Math.abs(stats.medianFps-60)<0.01)
  assert.ok(Math.abs(stats.p95Ms-1000/60)<0.001)
})

test('013 percentile nearest rank surfaces 95th frame intervals, not average FPS', () => {
  const window=new FrameMetricWindow(300,30)
  for(let i=0;i<95;i++)window.record(0.016)
  for(let i=0;i<5;i++)window.record(0.050)
  const stats=window.snapshot()
  assert.ok(stats)
  assert.equal(stats.count,100)
  assert.equal(stats.medianFps,62.5)
  assert.equal(stats.p95Ms,16)
})

test('013 ignores invalid, paused or background frame gaps', () => {
  const window=new FrameMetricWindow(300,30)
  for(const sample of [0,-1,Infinity,NaN,0.251,10,0.0005])window.record(sample)
  assert.equal(window.snapshot(),null)
  for(let i=0;i<30;i++)window.record(0.020)
  const stats=window.snapshot()
  assert.equal(stats?.count,30)
  assert.equal(stats?.medianFps,50)
})

test('013 bounded 300-frame rolling window forgets old low FPS samples', () => {
  const window=new FrameMetricWindow(300,30)
  for(let i=0;i<100;i++)window.record(0.050)
  for(let i=0;i<300;i++)window.record(0.010)
  const stats=window.snapshot()
  assert.equal(stats?.count,300)
  assert.equal(stats?.medianFps,100)
  assert.equal(stats?.p95Ms,10)
  window.clear()
  assert.equal(window.snapshot(),null)
})
