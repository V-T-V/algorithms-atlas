import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, pathToNode } from '../../src/algorithms/tree/tree-bfs-path-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bfs-path-2/trace.ts';
test('pathToNode 正确', () => {
  assert.deepEqual(pathToNode(buildTree([1, 2, 3, 4, 5]), 5), [1, 2, 5]);
  assert.equal(pathToNode(buildTree([1, 2, 3]), 9), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
