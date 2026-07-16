import { test } from 'node:test';
import assert from 'node:assert/strict';
import { median } from '../../src/algorithms/numerical/num-median/impl.ts';
test('奇数中位数', () => {
  assert.equal(median([1, 2, 3, 4, 5]), 3);
});
test('偶数中位数', () => {
  assert.equal(median([1, 2, 3, 4]), 2.5);
});
