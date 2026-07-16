import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patienceSort } from '../../src/algorithms/sorting/patience-sort/impl.ts';

test('patienceSort 基本排序', () => {
  assert.deepEqual(patienceSort([]), []);
  assert.deepEqual(patienceSort([1]), [1]);
  assert.deepEqual(patienceSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(patienceSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('patienceSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(patienceSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(patienceSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(patienceSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('patienceSort 不修改原数组', () => {
  const input = [3, 1, 2];
  patienceSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('patienceSort 钩子被调用', () => {
  let places = 0;
  let picks = 0;
  patienceSort([3, 1, 2], {
    onPlace: () => places++,
    onMergePick: () => picks++,
  });
  assert.equal(places, 3, '每个元素分堆一次');
  assert.equal(picks, 3, '合并取走每个元素一次');
});
