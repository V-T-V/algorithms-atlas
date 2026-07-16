import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sampleK } from '../../src/algorithms/randomized/rand-sample-k/impl.ts';
test('数量正确', () => {
  assert.equal(sampleK([1, 2, 3, 4, 5], 3, 42).length, 3);
});
test('元素来自原数组', () => {
  const s = sampleK([10, 20, 30, 40], 2, 5);
  assert.ok(s.every((x) => [10, 20, 30, 40].includes(x)));
});
test('k 越界报错', () => {
  assert.throws(() => sampleK([1, 2], 5, 1), RangeError);
});
