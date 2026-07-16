import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBarber } from '../../src/algorithms/concurrency/barber-sleeping/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/concurrency/barber-sleeping/trace.ts';

test('barber 顾客少时全部服务无丢弃', () => {
  const r = simulateBarber(
    [
      { id: 1, arrival: 0, serviceTime: 5 },
      { id: 2, arrival: 2, serviceTime: 3 },
    ],
    2,
  );
  assert.equal(r.served, 2);
  assert.equal(r.lost, 0);
});

test('barber 椅子满时丢弃顾客', () => {
  // 理发师理发 0-5，顾客 2/3/4 同时到达，椅子=1：第一位进理发椅，第二位坐等，第三位丢弃
  const r = simulateBarber(
    [
      { id: 1, arrival: 0, serviceTime: 5 },
      { id: 2, arrival: 1, serviceTime: 3 },
      { id: 3, arrival: 1, serviceTime: 3 },
    ],
    1,
  );
  assert.equal(r.served, 2);
  assert.equal(r.lost, 1);
});

test('barber 理发师睡眠时唤醒立即理发', () => {
  let wakeAt = -1;
  let startAt = -1;
  simulateBarber([{ id: 1, arrival: 3, serviceTime: 2 }], 2, {
    onWake: (t) => (wakeAt = t),
    onStartCut: (_c, t) => (startAt = t),
  });
  assert.equal(wakeAt, 3);
  assert.equal(startAt, 3);
});

test('barber 队列空时理发师入睡', () => {
  let sleepAt = -1;
  simulateBarber([{ id: 1, arrival: 0, serviceTime: 2 }], 2, {
    onSleep: (t) => (sleepAt = t),
  });
  assert.equal(sleepAt, 2); // 0+2 完成后入睡
});

test('barber 按到达顺序服务（FIFO）', () => {
  const r = simulateBarber(
    [
      { id: 1, arrival: 0, serviceTime: 10 },
      { id: 2, arrival: 1, serviceTime: 1 },
      { id: 3, arrival: 2, serviceTime: 1 },
    ],
    2,
  );
  assert.equal(r.served, 3);
  // 完成顺序：1（0-10），2（10-11），3（11-12）
  assert.deepEqual(
    r.completed.map((c) => c.id),
    [1, 2, 3],
  );
});

test('barber 0 把椅子：仅能服务 1 个', () => {
  const r = simulateBarber(
    [
      { id: 1, arrival: 0, serviceTime: 5 },
      { id: 2, arrival: 1, serviceTime: 3 }, // 忙且无椅 → 丢弃
    ],
    0,
  );
  assert.equal(r.served, 1);
  assert.equal(r.lost, 1);
});

test('barber 空输入', () => {
  const r = simulateBarber([], 2);
  assert.equal(r.served, 0);
  assert.equal(r.lost, 0);
});

test('barber 钩子 onFinishCut 触发', () => {
  const finishes: number[] = [];
  simulateBarber(
    [
      { id: 1, arrival: 0, serviceTime: 2 },
      { id: 2, arrival: 1, serviceTime: 3 },
    ],
    2,
    {
      onFinishCut: (c) => finishes.push(c.id),
    },
  );
  assert.deepEqual(finishes, [1, 2]);
});

test('barber 顾客到达顺序不规律仍按 arrival 排序', () => {
  const r = simulateBarber(
    [
      { id: 3, arrival: 5, serviceTime: 1 },
      { id: 1, arrival: 0, serviceTime: 1 },
      { id: 2, arrival: 2, serviceTime: 1 },
    ],
    2,
  );
  assert.equal(r.served, 3);
  assert.deepEqual(
    r.completed.map((c) => c.id),
    [1, 2, 3],
  );
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
