import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countUnival } from '../../src/algorithms/tree/tree-count-unival-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-count-unival-2/trace.ts';
test('countUnival 正确', () => {
  assert.equal(countUnival(buildTree([5, 1, 5, 5, 5, null, 5])), 4);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
