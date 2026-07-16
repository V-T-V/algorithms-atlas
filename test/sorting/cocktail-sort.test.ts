import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cocktailSort } from '../../src/algorithms/sorting/cocktail-sort/impl.ts';

test('cocktailSort 基本排序', () => {
  assert.deepEqual(cocktailSort([]), []);
  assert.deepEqual(cocktailSort([1]), [1]);
  assert.deepEqual(cocktailSort([2, 1]), [1, 2]);
  assert.deepEqual(cocktailSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('cocktailSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(cocktailSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cocktailSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cocktailSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('cocktailSort 不修改原数组', () => {
  const input = [3, 1, 2];
  cocktailSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('cocktailSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  let sorted = 0;
  let fwd = 0;
  let bwd = 0;
  cocktailSort([3, 2, 1], {
    onForwardStart: () => fwd++,
    onBackwardStart: () => bwd++,
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onSorted: () => sorted++,
  });
  assert.ok(fwd >= 1, '应至少触发一次正向扫描');
  assert.ok(bwd >= 1, '应至少触发一次反向扫描');
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(swaps > 0, '应发生至少一次交换');
  assert.equal(sorted, 3, '应标记 3 个位置就位');
});

test('cocktailSort 已有序时只正向扫描一次后即停', () => {
  let fwd = 0;
  let bwd = 0;
  cocktailSort([1, 2, 3, 4, 5], {
    onForwardStart: () => fwd++,
    onBackwardStart: () => bwd++,
  });
  assert.equal(fwd, 1, '已有序数组正向扫描应只触发 1 次');
  assert.equal(bwd, 0, '无交换则不应触发反向扫描');
});
