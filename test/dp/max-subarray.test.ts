import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxSubarray } from '../../src/algorithms/dp/max-subarray/impl.ts';

test('max-subarray 经典用例（LeetCode #53）', () => {
  const r = maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  assert.equal(r.best, 6);
  assert.deepEqual(r.subarray, [4, -1, 2, 1]);
  assert.equal(r.start, 3);
  assert.equal(r.end, 6);
});

test('max-subarray 全负取最大单元素', () => {
  const r = maxSubarray([-5, -2, -9]);
  assert.equal(r.best, -2);
  assert.deepEqual(r.subarray, [-2]);
  assert.equal(r.start, 1);
  assert.equal(r.end, 1);
});

test('max-subarray 单元素', () => {
  assert.deepEqual(maxSubarray([5]), { best: 5, start: 0, end: 0, subarray: [5] });
});

test('max-subarray 空数组', () => {
  assert.deepEqual(maxSubarray([]), { best: 0, start: -1, end: -1, subarray: [] });
});

test('max-subarray 全正取整个数组', () => {
  const r = maxSubarray([1, 2, 3, 4]);
  assert.equal(r.best, 10);
  assert.equal(r.start, 0);
  assert.equal(r.end, 3);
});

test('max-subarray 子段和等于实际求和', () => {
  const r = maxSubarray([2, -1, 3, -2, 4, -5, 2]);
  const sum = r.subarray.reduce((a, b) => a + b, 0);
  assert.equal(sum, r.best);
  // 校验索引
  const arr = [2, -1, 3, -2, 4, -5, 2];
  assert.deepEqual(r.subarray, arr.slice(r.start, r.end + 1));
});

test('max-subarray 钩子被调用', () => {
  let steps = 0;
  let improves = 0;
  let doneBest = -Infinity;
  maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4], {
    onStep: () => steps++,
    onImprove: () => improves++,
    onDone: (b) => {
      doneBest = b;
    },
  });
  assert.equal(steps, 9, '每个元素访问一次');
  assert.ok(improves >= 1, '至少刷新一次最优');
  assert.equal(doneBest, 6);
});
