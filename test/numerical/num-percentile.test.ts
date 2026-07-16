import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentile } from '../../src/algorithms/numerical/num-percentile/impl.ts';
test('中位数', () => {
  assert.equal(percentile([1, 2, 3, 4, 5], 50), 3);
});
