import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zScoreScale } from '../../src/algorithms/ml/ml-z-score-scale/impl.ts';
test('Z-Score 均值≈0', () => {
  assert.ok(Math.abs(zScoreScale([1, 2, 3, 4]).reduce((a, b) => a + b, 0)) < 1e-9);
});
