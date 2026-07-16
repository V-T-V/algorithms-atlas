import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraTrees, predictExtra } from '../../src/algorithms/ml/ml-random-forest-extra/impl.ts';
test('Extra Trees 可调用', () => {
  const X = [
      [1, 1],
      [1, 2],
      [5, 5],
      [6, 6],
    ],
    y = [0, 0, 1, 1];
  const m = extraTrees(X, y, 20);
  assert.equal(typeof predictExtra(m, [3, 3]), 'number');
});
