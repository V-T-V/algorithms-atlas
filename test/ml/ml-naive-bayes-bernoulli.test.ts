import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trainBernoulliNB,
  predictBernoulliNB,
} from '../../src/algorithms/ml/ml-naive-bayes-bernoulli/impl.ts';
test('伯努利NB 训练+预测', () => {
  const X = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    y = [0, 1, 0, 1];
  const m = trainBernoulliNB(X, y);
  assert.equal(typeof predictBernoulliNB(m, [1, 0, 1]), 'number');
});
