import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCart, predictCart } from '../../src/algorithms/ml/ml-decision-tree-cart/impl.ts';
test('CART 可分', () => {
  const X = [
      [1, 1],
      [2, 1],
      [5, 5],
      [6, 5],
    ],
    y = [0, 0, 1, 1];
  const t = buildCart(X, y);
  for (let i = 0; i < X.length; i++) assert.equal(predictCart(t, X[i]!), y[i]);
});
