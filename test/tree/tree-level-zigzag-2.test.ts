import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, zigzagLevelOrder } from '../../src/algorithms/tree/tree-level-zigzag-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-level-zigzag-2/trace.ts';
test('zigzagLevelOrder 正确', () => {
  assert.deepEqual(zigzagLevelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [
    [3],
    [20, 9],
    [15, 7],
  ]);
  assert.deepEqual(zigzagLevelOrder(null), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
