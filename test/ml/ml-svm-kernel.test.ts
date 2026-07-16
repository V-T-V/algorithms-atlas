import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kernelPerceptron, kernelPredict } from '../../src/algorithms/ml/ml-svm-kernel/impl.ts';
test('核感知器 非线性', () => {
  const X = [
      [0, 0],
      [0, 1],
      [1, 0],
      [3, 3],
      [4, 4],
      [3, 4],
    ],
    y = [-1, -1, -1, 1, 1, 1];
  const m = kernelPerceptron(X, y, 2, 1, 20);
  let ok = 0;
  for (let i = 0; i < X.length; i++) if (kernelPredict(m, X[i]!) === y[i]) ok++;
  assert.ok(ok >= 4);
});
