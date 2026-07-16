import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, findTilt } from '../../src/algorithms/tree/tree-tilt-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-tilt-2/trace.ts';
test('findTilt 正确', () => {
  assert.equal(findTilt(buildTree([1, 2, 3])), 1);
  assert.equal(findTilt(buildTree([4, 2, 9, 3, 5, null, 7])), 15);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
