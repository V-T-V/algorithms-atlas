import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinHeightTrees } from '../../src/algorithms/network/net-min-height-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-min-height-tree/trace.ts';
test('findMinHeightTrees 正确', () => {
  assert.deepEqual(
    findMinHeightTrees(6, [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 4],
      [5, 4],
    ]).sort((a, b) => a - b),
    [3, 4],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
