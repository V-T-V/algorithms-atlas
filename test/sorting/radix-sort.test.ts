import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radixSort } from '../../src/algorithms/sorting/radix-sort/impl.ts';

test('radix-sort 基本行为', () => {
  assert.deepEqual(radixSort([]), []);
  assert.deepEqual(radixSort([1]), [1]);
  // TODO: 补充该算法的期望输出断言
});
