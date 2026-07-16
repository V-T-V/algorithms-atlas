import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lazySelect } from '../../src/algorithms/randomized/rand-lazy-select/impl.ts';
test('第 4 小', () => {
  // sorted: [1,1,2,3,4,5,6,9], 4th = 3
  const v = lazySelect([3, 1, 4, 1, 5, 9, 2, 6], 4, 42);
  assert.ok(v >= 2 && v <= 5);
});
test('最小', () => {
  const v = lazySelect([5, 3, 8, 1, 9], 1, 1);
  assert.equal(v, 1);
});
