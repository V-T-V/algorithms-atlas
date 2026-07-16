import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trainPegasos,
  predictSVM,
  decisionValue,
} from '../../src/algorithms/ml/ml-svm-soft/impl.ts';
test('Pegasos 分离线性可分', () => {
  const X = [
      [1, 1],
      [1, 2],
      [5, 5],
      [6, 6],
    ],
    y = [-1, -1, 1, 1];
  const m = trainPegasos(X, y, 0.01, 100, 42);
  for (let i = 0; i < X.length; i++) assert.equal(predictSVM(m, X[i]!), y[i]);
});
test('标签必须 ±1', () => {
  assert.throws(() => trainPegasos([[1]], [2], 0.01), RangeError);
});
test('空集抛错', () => {
  assert.throws(() => trainPegasos([], [], 0.01), RangeError);
});
