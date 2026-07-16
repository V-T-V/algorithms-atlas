import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hingeLoss } from '../../src/algorithms/ml/ml-hinge-loss/impl.ts';
test('hinge 满足间隔=0', () => {
  assert.equal(hingeLoss(1, 2), 0);
});
test('hinge 不满足=0.5', () => {
  assert.equal(hingeLoss(1, 0.5), 0.5);
});
