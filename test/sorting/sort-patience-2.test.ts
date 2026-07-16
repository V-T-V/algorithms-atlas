import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patienceSort2 } from '../../src/algorithms/sorting/sort-patience-2/impl.ts';

test('patienceSort2 基本排序', () => {
  assert.deepEqual(patienceSort2([]), []);
  assert.deepEqual(patienceSort2([1]), [1]);
  assert.deepEqual(patienceSort2([4, 2, 7, 1, 5, 3, 6]), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(patienceSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('patienceSort2 已有序/逆序/重复', () => {
  assert.deepEqual(patienceSort2([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(patienceSort2([3, 2, 1]), [1, 2, 3]);
  assert.deepEqual(patienceSort2([3, 1, 3, 2, 1]), [1, 1, 2, 3, 3]);
});

test('patienceSort2 堆数等于 LIS 长度', () => {
  let piles = 0;
  patienceSort2([4, 2, 7, 1, 5, 3, 6], { onMergeStart: (c) => (piles = c) });
  // LIS of [4,2,7,1,5,3,6] = [2,3,6] or [1,3,6] 等，长度 3
  assert.equal(piles, 3);
});

test('patienceSort2 不修改原数组', () => {
  const input = [3, 1, 2];
  patienceSort2(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('patienceSort2 钩子被调用', () => {
  let newPiles = 0;
  patienceSort2([3, 1, 2], { onNewPile: () => newPiles++ });
  assert.ok(newPiles >= 1);
});
