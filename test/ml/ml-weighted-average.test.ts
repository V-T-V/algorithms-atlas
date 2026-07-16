import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedAverageEnsemble } from '../../src/algorithms/ml/ml-weighted-average/impl.ts';
test('等权平均', () => {
  assert.deepEqual(
    weightedAverageEnsemble(
      [
        [1, 2],
        [3, 4],
      ],
      [1, 1],
    ),
    [2, 3],
  );
});
