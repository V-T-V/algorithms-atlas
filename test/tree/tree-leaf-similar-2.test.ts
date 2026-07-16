import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, leafSimilar } from '../../src/algorithms/tree/tree-leaf-similar-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-leaf-similar-2/trace.ts';
test('leafSimilar 正确', () => {
  assert.equal(
    leafSimilar(
      buildTree([3, 5, 1, 6, 2, 9, 8, null, null, 7, 4]),
      buildTree([3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, 9, 8]),
    ),
    true,
  );
  assert.equal(leafSimilar(buildTree([1, 2, 3]), buildTree([1, 3, 2])), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
