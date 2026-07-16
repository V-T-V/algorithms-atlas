import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, diameter } from '../../src/algorithms/tree/tree-diameter-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-diameter-2/trace.ts';
test('diameter 正确', () => {
  assert.equal(diameter(buildTree([1, 2, 3, 4, 5])), 3);
  assert.equal(diameter(buildTree([1])), 0);
  assert.equal(diameter(null), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
