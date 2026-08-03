import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Playback } from '../../src/core/playback.ts';

test('playback：装载帧并回到起点（index=0）', () => {
  const p = new Playback();
  p.load([1, 2, 3]);
  assert.equal(p.currentIndex, 0);
  assert.equal(p.total, 3);
});

test('playback：stepForward / stepBack 在边界内移动且不越界', () => {
  const p = new Playback();
  p.load([10, 20, 30]);
  p.stepForward();
  assert.equal(p.currentIndex, 1);
  p.stepForward();
  assert.equal(p.currentIndex, 2);
  // 末尾再前进无效
  p.stepForward();
  assert.equal(p.currentIndex, 2);
  p.stepBack();
  assert.equal(p.currentIndex, 1);
  p.stepBack();
  assert.equal(p.currentIndex, 0);
  // 起点再后退无效
  p.stepBack();
  assert.equal(p.currentIndex, 0);
});

test('playback：seek 钳制到合法范围', () => {
  const p = new Playback();
  p.load([1, 2, 3, 4, 5]);
  p.seek(3);
  assert.equal(p.currentIndex, 3);
  p.seek(999);
  assert.equal(p.currentIndex, 4); // 钳到末尾
  p.seek(-5);
  assert.equal(p.currentIndex, 0); // 钳到起点
});

test('playback：reset 回到第 0 帧', () => {
  const p = new Playback();
  p.load([1, 2, 3]);
  p.seek(2);
  p.reset();
  assert.equal(p.currentIndex, 0);
});

test('playback：setSpeed 钳制到 [0.25, 4]', () => {
  const p = new Playback();
  p.setSpeed(10);
  assert.equal(p['speed'], 4);
  p.setSpeed(0.01);
  assert.equal(p['speed'], 0.25);
  p.setSpeed(2);
  assert.equal(p['speed'], 2);
});

test('playback：onSpeedEvent 通知订阅者（含钳制后的值）', () => {
  const p = new Playback();
  const speeds: number[] = [];
  p.onSpeedEvent((s) => speeds.push(s));
  // 初始 1 已在订阅时推入
  assert.deepEqual(speeds, [1]);
  p.setSpeed(10); // 钳到 4
  assert.equal(speeds.at(-1), 4);
});

test('playback：空帧序列 play 不启动（安全）', () => {
  const p = new Playback();
  p.load([]);
  p.play();
  assert.equal(p.isPlaying, false);
  assert.equal(p.total, 0);
});

test('playback：onTickEvent 立即推送当前状态并支持取消订阅', () => {
  const p = new Playback();
  p.load([1, 2, 3]);
  const ticks: Array<[number, number]> = [];
  const off = p.onTickEvent((i, total) => ticks.push([i, total]));
  // 订阅时立即推送一次
  assert.deepEqual(ticks, [[0, 3]]);
  p.stepForward();
  assert.deepEqual(ticks.at(-1), [1, 3]);
  off();
  const before = ticks.length;
  p.stepForward();
  assert.equal(ticks.length, before, '取消订阅后不应再收到事件');
});

test('playback：stepForward 自动暂停正在进行的播放', () => {
  const p = new Playback({ baseDelayMs: 1000 });
  p.load([1, 2, 3]);
  p.play();
  assert.equal(p.isPlaying, true);
  p.stepForward();
  assert.equal(p.isPlaying, false, '单步应自动暂停');
});

test('playback：dispose 清理订阅与定时器，可重复调用', () => {
  const p = new Playback();
  p.load([1, 2, 3]);
  p.onTickEvent(() => undefined);
  p.onPlayStateEvent(() => undefined);
  p.dispose();
  assert.equal(p.isPlaying, false);
  // 重复 dispose 不抛
  assert.doesNotThrow(() => p.dispose());
});

test('playback：onRender 回调在 load/seek/step 时被调用', () => {
  const p = new Playback();
  const rendered: number[] = [];
  p.onRender((i) => rendered.push(i));
  p.load([1, 2, 3]); // load 触发一次 render(index=0)
  assert.ok(rendered.includes(0));
  p.seek(2);
  assert.ok(rendered.includes(2));
});
