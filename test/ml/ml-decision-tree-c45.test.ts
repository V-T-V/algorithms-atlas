import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildC45, predictC45 } from '../../src/algorithms/ml/ml-decision-tree-c45/impl.ts';
test('C4.5 可分', () => {
  const X = [
      [1, 1],
      [1, 2],
      [5, 5],
      [6, 6],
    ],
    y = [0, 0, 1, 1];
  const t = buildC45(X, y);
  for (let i = 0; i < X.length; i++) assert.equal(predictC45(t, X[i]!), y[i]);
});
