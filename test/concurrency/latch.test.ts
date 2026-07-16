import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Latch, simulateLatch } from '../../src/algorithms/concurrency/latch/impl.ts';
import { buildTrace, defaultEvents } from '../../src/algorithms/concurrency/latch/trace.ts';

test('latch countDown 归零后 await 立即返回', () => {
  const l = new Latch(1);
  l.countDown(0);
  assert.equal(l.isOpen, true);
  assert.equal(l.await(1), true);
});

test('latch 未归零时 await 阻塞', () => {
  const l = new Latch(2);
  assert.equal(l.await(0), false);
  assert.deepEqual(l.waiting, [0]);
});

test('latch countDown 逐次递减', () => {
  const l = new Latch(3);
  l.countDown(0);
  assert.equal(l.remaining, 2);
  l.countDown(1);
  assert.equal(l.remaining, 1);
  l.countDown(2);
  assert.equal(l.remaining, 0);
});

test('latch 归零后多余 countDown 保持 0', () => {
  const l = new Latch(1);
  l.countDown(0);
  l.countDown(0);
  assert.equal(l.remaining, 0);
});

test('latch 归零瞬间唤醒全部等待者', () => {
  const l = new Latch(2);
  l.await(0);
  l.await(1);
  l.await(2);
  l.countDown(10); // 2->1
  assert.equal(l.waiting.length, 3);
  l.countDown(11); // 1->0 → 释放
  assert.equal(l.waiting.length, 0);
  assert.equal(l.isOpen, true);
});

test('latch 初始计数 0 立即打开', () => {
  const l = new Latch(0);
  assert.ok(l.isOpen);
  assert.equal(l.await(0), true);
});

test('latch simulate 钩子 onRelease', () => {
  let released: number[] = [];
  simulateLatch(
    1,
    2,
    [
      { thread: 0, action: 'await' },
      { thread: 1, action: 'countDown' },
    ],
    { onRelease: (w) => (released = [...w]) },
  );
  assert.deepEqual(released, [0]);
});

test('latch simulate 多线程等待状态', () => {
  const steps = simulateLatch(2, 3, [
    { thread: 0, action: 'await' },
    { thread: 1, action: 'await' },
    { thread: 2, action: 'countDown' }, // 2->1
    { thread: 2, action: 'countDown' }, // 1->0
  ]);
  // 第三步后两人仍 waiting
  assert.equal(steps[2]!.states[0], 'waiting');
  assert.equal(steps[2]!.states[1], 'waiting');
  // 第四步归零后两人 released
  assert.equal(steps[3]!.states[0], 'released');
  assert.equal(steps[3]!.states[1], 'released');
});

test('latch simulate await 在已打开门上立即 released', () => {
  const steps = simulateLatch(1, 2, [
    { thread: 0, action: 'countDown' },
    { thread: 1, action: 'await' },
  ]);
  assert.equal(steps[1]!.states[1], 'released');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace({ events: defaultEvents() });
  assert.ok(frames.length >= 5);
});
