import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxMinFairness } from '../../src/algorithms/scheduling/max-min-fairness/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/max-min-fairness/trace.ts';

test('maxMinFairness 经典：需求 [30,10,60,40]，容量 10', () => {
  const r = maxMinFairness(
    [
      { id: 'A', demand: 30 },
      { id: 'B', demand: 10 },
      { id: 'C', demand: 60 },
      { id: 'D', demand: 40 },
    ],
    10,
  );
  // 容量不足，均分 2.5
  for (const a of r.allocations) {
    assert.equal(a.allocated, 2.5);
    assert.equal(a.saturated, false);
  }
});

test('maxMinFairness 容量充足全饱和', () => {
  const r = maxMinFairness(
    [
      { id: 'A', demand: 5 },
      { id: 'B', demand: 5 },
    ],
    100,
  );
  assert.equal(r.allSaturated, true);
  assert.equal(r.allocations[0]!.allocated, 5);
  assert.equal(r.allocations[1]!.allocated, 5);
});

test('maxMinFairness 渐进填充', () => {
  // 需求 [3, 7]，容量 8：先均 4 → A 饱和 3（剩 1 给 B）→ B=5
  const r = maxMinFairness(
    [
      { id: 'A', demand: 3 },
      { id: 'B', demand: 7 },
    ],
    8,
  );
  assert.equal(r.allocations[0]!.allocated, 3);
  assert.equal(r.allocations[1]!.allocated, 5);
  assert.equal(r.totalAllocated, 8);
});

test('maxMinFairness 分配总和不超过容量', () => {
  const r = maxMinFairness(
    [
      { id: 'A', demand: 10 },
      { id: 'B', demand: 20 },
      { id: 'C', demand: 30 },
    ],
    15,
  );
  assert.ok(r.totalAllocated <= 15 + 1e-6);
});

test('maxMinFairness 钩子被调用', () => {
  let rounds = 0;
  maxMinFairness(
    [
      { id: 'A', demand: 2 },
      { id: 'B', demand: 10 },
    ],
    10,
    { onRound: () => rounds++ },
  );
  assert.ok(rounds >= 1);
});

test('maxMinFairness 空输入', () => {
  const r = maxMinFairness([], 100);
  assert.deepEqual(r.allocations, []);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
