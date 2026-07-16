import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOfMedians } from '../../src/algorithms/selection/median-of-medians/impl.ts';

test('medianOfMedians 第 k 小', () => {
  const a = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(medianOfMedians(a, 0), 1); // 最小
  assert.equal(medianOfMedians(a, 4), 5); // 中位数
  assert.equal(medianOfMedians(a, 8), 9); // 最大
  assert.equal(medianOfMedians(a, 2), 3);
  assert.equal(medianOfMedians(a, 6), 7);
});

test('medianOfMedians 边界', () => {
  assert.equal(medianOfMedians([42], 0), 42); // 单元素
  assert.equal(medianOfMedians([3, 1], 0), 1);
  assert.equal(medianOfMedians([3, 1], 1), 3);
});

test('medianOfMedians 已序 / 逆序 / 重复', () => {
  assert.equal(medianOfMedians([1, 2, 3, 4, 5], 2), 3);
  assert.equal(medianOfMedians([5, 4, 3, 2, 1], 2), 3);
  assert.equal(medianOfMedians([3, 3, 1, 2, 2], 2), 2);
});

test('medianOfMedians 与快选结果一致（全量对照）', () => {
  const a = [9, 4, 7, 2, 8, 1, 5, 6, 3, 0, 12, 11, 10];
  const sorted = [...a].sort((x, y) => x - y);
  for (let k = 0; k < a.length; k++) {
    assert.equal(medianOfMedians(a, k), sorted[k], `rank ${k}`);
  }
});

test('medianOfMedians 不修改原数组', () => {
  const input = [3, 1, 2];
  medianOfMedians(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('medianOfMedians 钩子被调用', () => {
  let pivots = 0;
  let pinned = 0;
  medianOfMedians([3, 2, 1, 5, 4], 0, {
    onPivotChosen: () => pivots++,
    onPinned: () => pinned++,
  });
  assert.ok(pivots >= 1, '应至少选过一次基准');
  assert.equal(pinned, 1, '应恰好命中一次');
});
