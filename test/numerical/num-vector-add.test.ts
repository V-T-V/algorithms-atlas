import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vAdd, vSub } from '../../src/algorithms/numerical/num-vector-add/impl.ts';
test('加', () => {
  assert.deepEqual(vAdd([1, 2], [3, 4]), [4, 6]);
});
test('减', () => {
  assert.deepEqual(vSub([1, 2], [3, 4]), [-2, -2]);
});
