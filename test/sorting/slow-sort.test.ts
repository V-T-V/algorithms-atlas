import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slowSort } from '../../src/algorithms/sorting/slow-sort/impl.ts';

test('slowSort 基本排序（小输入）', () => {
  assert.deepEqual(slowSort([]), []);
  assert.deepEqual(slowSort([1]), [1]);
  assert.deepEqual(slowSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(slowSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
});

test('slowSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(slowSort([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(slowSort([3, 2, 1]), [1, 2, 3]);
  assert.deepEqual(slowSort([3, 3, 1, 2]), [1, 2, 3, 3]);
});

test('slowSort 不修改原数组', () => {
  const input = [3, 1, 2];
  slowSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('slowSort 钩子被调用', () => {
  let places = 0;
  slowSort([3, 1, 2], {
    onMaxPlaced: () => places++,
  });
  assert.ok(places >= 1, '应至少一次最大值就位');
});
