import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smoothSort, type SmoothHooks } from '../../src/algorithms/sorting/sort-smooth/impl.ts';

test('smoothSort 基本', () => {
  assert.deepEqual(smoothSort([]), []);
  assert.deepEqual(smoothSort([1]), [1]);
  assert.deepEqual(smoothSort([2, 1]), [1, 2]);
  assert.deepEqual(smoothSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('smoothSort 逆序/重复', () => {
  assert.deepEqual(smoothSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(smoothSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('smoothSort 已有序快速返回', () => {
  let c = 0;
  const r = smoothSort([1, 2, 3, 4, 5], { onTrickle: () => c++ } as SmoothHooks);
  assert.deepEqual(r, [1, 2, 3, 4, 5]);
  assert.ok(c >= 1);
});
