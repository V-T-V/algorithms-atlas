import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reverseII } from '../../src/algorithms/list/reverse-ii/impl.ts';

test('reverseII 区间反转', () => {
  assert.deepEqual(listToArray(reverseII(buildList([1, 2, 3, 4, 5]), 2, 4)), [1, 4, 3, 2, 5]);
  assert.deepEqual(listToArray(reverseII(buildList([5]), 1, 1)), [5]);
  assert.deepEqual(listToArray(reverseII(buildList([1, 2, 3, 4]), 1, 4)), [4, 3, 2, 1]);
  assert.deepEqual(listToArray(reverseII(buildList([1, 2, 3]), 2, 3)), [1, 3, 2]);
});

test('reverseII 钩子', () => {
  let flips = 0;
  reverseII(buildList([1, 2, 3, 4, 5]), 2, 4, { onFlip: () => flips++ });
  assert.equal(flips, 2); // 反转 2,3,4 需 2 次翻转
});
