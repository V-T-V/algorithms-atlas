import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trainGaussianNB,
  predictGaussianNB,
} from '../../src/algorithms/ml/ml-naive-bayes-gaussian/impl.ts';
test('高斯NB 两类', () => {
  const X = [
      [1, 1],
      [1.1, 0.9],
      [5, 5],
      [5.1, 4.9],
    ],
    y = [0, 0, 1, 1];
  const m = trainGaussianNB(X, y);
  let ok = 0;
  for (let i = 0; i < X.length; i++) if (predictGaussianNB(m, X[i]!) === y[i]) ok++;
  assert.equal(ok, 4);
});
