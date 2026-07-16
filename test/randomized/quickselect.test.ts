import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselect } from '../../src/algorithms/randomized/quickselect/impl.ts';

test('quickselect 第 k 小', () => {
  const a = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(quickselect(a, 0), 1); // 最小
  assert.equal(quickselect(a, 4), 5); // 中位数
  assert.equal(quickselect(a, 8), 9); // 最大
  assert.equal(quickselect(a, 2), 3);
  assert.equal(quickselect(a, 6), 7);
});

test('quickselect 边界', () => {
  assert.equal(quickselect([42], 0), 42); // 单元素
  assert.equal(quickselect([3, 1], 0), 1);
  assert.equal(quickselect([3, 1], 1), 3);
});

test('quickselect 已序 / 逆序 / 重复', () => {
  assert.equal(quickselect([1, 2, 3, 4, 5], 2), 3);
  assert.equal(quickselect([5, 4, 3, 2, 1], 2), 3);
  assert.equal(quickselect([3, 3, 1, 2, 2], 2), 2);
});

test('quickselect 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselect(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselect 钩子被调用', () => {
  let swaps = 0;
  let pinned = 0;
  quickselect([3, 2, 1], 0, {
    onSwap: () => swaps++,
    onPinned: () => pinned++,
  });
  assert.equal(pinned, 1, '应恰好命中一次');
  assert.equal(quickselect([3, 2, 1], 0), 1);
});
