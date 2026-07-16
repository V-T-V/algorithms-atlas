import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ovrSvm, predictOvr } from '../../src/algorithms/ml/ml-svm-multiclass/impl.ts';
test('OvR 三类', () => {
  const X = [
      [1, 1],
      [1, 2],
      [5, 5],
      [6, 6],
      [1, 6],
      [2, 6],
    ],
    labels = [0, 0, 1, 1, 2, 2];
  const m = ovrSvm(X, labels, 3, 0.01, 100);
  let ok = 0;
  for (let i = 0; i < X.length; i++) if (predictOvr(m, X[i]!) === labels[i]) ok++;
  assert.ok(ok >= 4);
});
