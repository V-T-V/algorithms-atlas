import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, areCousins } from '../../src/algorithms/tree/tree-cousins-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-cousins-2/trace.ts';
test('areCousins 正确', () => {
  assert.equal(areCousins(buildTree([1, 2, 3, 4]), 4, 3), false); // 同父
  assert.equal(areCousins(buildTree([1, 2, 3, null, 4, null, 5]), 4, 5), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
