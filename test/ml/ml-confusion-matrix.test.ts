import { test } from 'node:test';
import assert from 'node:assert/strict';
import { confusionMatrix } from '../../src/algorithms/ml/ml-confusion-matrix/impl.ts';
test('混淆矩阵', () => {
  assert.deepEqual(confusionMatrix([0, 1, 1, 0], [0, 1, 0, 0], 2), [
    [2, 0],
    [1, 1],
  ]);
});
