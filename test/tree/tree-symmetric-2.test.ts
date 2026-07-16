import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSymmetric } from '../../src/algorithms/tree/tree-symmetric-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-symmetric-2/trace.ts';
test('isSymmetric 正确', () => {
  assert.equal(isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3])), true);
  assert.equal(isSymmetric(buildTree([1, 2, 2, null, 3, null, 3])), false);
  assert.equal(isSymmetric(null), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
