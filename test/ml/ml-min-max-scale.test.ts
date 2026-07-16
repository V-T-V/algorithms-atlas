import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minMaxScale } from '../../src/algorithms/ml/ml-min-max-scale/impl.ts';
test('Min-Max [0,10]→[0,1]', () => {
  assert.deepEqual(minMaxScale([0, 5, 10]), [0, 0.5, 1]);
});
