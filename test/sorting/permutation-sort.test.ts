import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permutationSort } from '../../src/algorithms/sorting/permutation-sort/impl.ts';

test('permutationSort 基本排序', () => {
  assert.deepEqual(permutationSort([]), []);
  assert.deepEqual(permutationSort([1]), [1]);
  assert.deepEqual(permutationSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(permutationSort([3, 1, 4, 2]), [1, 2, 3, 4]);
});

test('permutationSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(permutationSort([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(permutationSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  assert.deepEqual(permutationSort([2, 2, 1, 1]), [1, 1, 2, 2]);
});

test('permutationSort 不修改原数组', () => {
  const input = [3, 1, 2];
  permutationSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('permutationSort 钩子：至少尝试一次，找到有序即停', () => {
  let attempts = 0;
  let lastSorted = false;
  permutationSort([2, 1], {
    onAttempt: () => attempts++,
    onCheck: (s) => {
      lastSorted = s;
    },
  });
  assert.ok(attempts >= 1);
  assert.equal(lastSorted, true);
});
