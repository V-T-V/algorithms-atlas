import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  logisticRegression,
  predictLabel,
  type LabeledPoint,
} from '../../src/algorithms/ml/logistic-regression/impl.ts';

const DATA: LabeledPoint[] = [
  { x: 1, y: 1, label: 0 },
  { x: 1.5, y: 1, label: 0 },
  { x: 1, y: 2, label: 0 },
  { x: 5, y: 5, label: 1 },
  { x: 6, y: 5, label: 1 },
  { x: 5, y: 6, label: 1 },
];

test('logistic-regression 分离两簇样本', () => {
  const result = logisticRegression(DATA, { learningRate: 0.2, maxIterations: 200, seed: 7 });
  assert.ok(result.accuracy >= 0.95);
  assert.equal(predictLabel(result, 1, 1), 0);
  assert.equal(predictLabel(result, 6, 6), 1);
});

test('logistic-regression 空数据返回 0 准确率且不崩溃', () => {
  const result = logisticRegression([], { maxIterations: 3, seed: 1 });
  assert.equal(result.accuracy, 0);
  assert.equal(result.iterations, 3);
});
