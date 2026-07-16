import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceMatrix } from '../../src/algorithms/ml/ml-euclidean-dist-matrix/impl.ts';
test('距离矩阵', () => {
  const D = distanceMatrix([
    [0, 0],
    [3, 4],
  ]);
  assert.equal(D[0]![1]!, 5);
  assert.equal(D[1]![0]!, 5);
});
