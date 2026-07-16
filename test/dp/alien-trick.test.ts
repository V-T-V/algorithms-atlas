import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alienTrick } from '../../src/algorithms/dp/alien-trick/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/alien-trick/trace.ts';

test('alien-trick 恰好 k 个的最大和', () => {
  // [5,1,9,2,8,3] 选 3 个最大：9+8+5 = 22
  assert.equal(alienTrick([5, 1, 9, 2, 8, 3], 3), 22);
  // 选 1 个：9
  assert.equal(alienTrick([5, 1, 9, 2, 8, 3], 1), 9);
  // 全选（k = n）：28
  assert.equal(alienTrick([5, 1, 9, 2, 8, 3], 6), 28);
});

test('alien-trick 含负数：被迫选最小的负值', () => {
  // [-1,-2,-3] 选 2 个最大：-1 + -2 = -3
  assert.equal(alienTrick([-1, -2, -3], 2), -3);
  // 选全部
  assert.equal(alienTrick([-1, -2, -3], 3), -6);
});

test('alien-trick 边界', () => {
  assert.equal(alienTrick([], 0), 0);
  assert.equal(alienTrick([7], 1), 7);
  assert.equal(alienTrick([1, 2, 3], 0), 0);
});

test('alien-trick 钩子被调用（二分多轮）', () => {
  let probes = 0;
  let decides = 0;
  let narrows = 0;
  alienTrick([5, 1, 9, 2, 8, 3], 3, {
    onProbe: () => probes++,
    onDecide: () => decides++,
    onNarrow: () => narrows++,
  });
  assert.ok(probes >= 2, '至少二分两轮');
  assert.ok(decides >= 2, '每轮应有一次判定');
  assert.ok(narrows >= 2, '每轮应收缩一次边界');
});

test('alien-trick buildTrace 产出非空帧且末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note?.zh.includes('最大和'));
  assert.equal(last.aux?.[0]?.role, 'final');
});
