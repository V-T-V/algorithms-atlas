import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giniIndex } from '../../src/algorithms/ml/ml-gini-index/impl.ts';
test('基尼 完全纯=0', () => {
  assert.equal(giniIndex([10, 0]), 0);
});
test('基尼 均分=0.5', () => {
  assert.ok(Math.abs(giniIndex([5, 5]) - 0.5) < 1e-9);
});
