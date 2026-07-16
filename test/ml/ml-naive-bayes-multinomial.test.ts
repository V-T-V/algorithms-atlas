import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trainMultinomialNB,
  predictMultinomialNB,
} from '../../src/algorithms/ml/ml-naive-bayes-multinomial/impl.ts';
test('多项式NB 训练', () => {
  const X = [
      [2, 1, 0],
      [1, 0, 2],
      [0, 2, 1],
      [5, 0, 0],
    ],
    y = [0, 1, 1, 0];
  const m = trainMultinomialNB(X, y);
  assert.equal(typeof predictMultinomialNB(m, [3, 0, 0]), 'number');
});
