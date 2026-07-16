import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, sumNumbers } from '../../src/algorithms/tree/tree-sum-root-leaf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-sum-root-leaf-2/trace.ts';
test('sumNumbers 正确', () => {
  assert.equal(sumNumbers(buildTree([1, 2, 3])), 25);
  assert.equal(sumNumbers(buildTree([4, 9, 0, 5, 1])), 1026);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
