import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transpose } from '../../src/algorithms/numerical/num-matrix-transpose/impl.ts';
test('转置', () => {
  assert.deepEqual(transpose([[1, 2, 3]]), [[1], [2], [3]]);
});
