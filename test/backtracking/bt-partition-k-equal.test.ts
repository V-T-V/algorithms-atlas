import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canPartitionKSubsets } from '../../src/algorithms/backtracking/bt-partition-k-equal/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-partition-k-equal/trace.ts';
test('canPartitionKSubsets 正确', () => {
  assert.equal(canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4), true);
  assert.equal(canPartitionKSubsets([1, 2, 3, 4], 3), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
