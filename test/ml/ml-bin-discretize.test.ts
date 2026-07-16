import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equalWidthBinning } from '../../src/algorithms/ml/ml-bin-discretize/impl.ts';
test('等宽分箱 k=2', () => {
  assert.deepEqual(equalWidthBinning([0, 1, 2, 3, 4], 2), [0, 0, 1, 1, 1]);
});
