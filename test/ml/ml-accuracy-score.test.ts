import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accuracy } from '../../src/algorithms/ml/ml-accuracy-score/impl.ts';
test('准确率 全对=1', () => {
  assert.equal(accuracy([0, 1], [0, 1]), 1);
});
test('准确率 半对=0.5', () => {
  assert.equal(accuracy([0, 1], [1, 1]), 0.5);
});
