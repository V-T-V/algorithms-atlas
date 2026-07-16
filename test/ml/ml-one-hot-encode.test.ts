import { test } from 'node:test';
import assert from 'node:assert/strict';
import { oneHot } from '../../src/algorithms/ml/ml-one-hot-encode/impl.ts';
test('独热编码', () => {
  assert.deepEqual(oneHot([0, 2], 3), [
    [1, 0, 0],
    [0, 0, 1],
  ]);
});
