import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTree,
  longestUnivaluePath,
} from '../../src/algorithms/tree/tree-longest-univalue-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-longest-univalue-2/trace.ts';
test('longestUnivaluePath 正确', () => {
  assert.equal(longestUnivaluePath(buildTree([5, 4, 5, 1, 1, null, 5])), 2);
  assert.equal(longestUnivaluePath(buildTree([1, 4, 5, 4, 4, null, 5])), 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
