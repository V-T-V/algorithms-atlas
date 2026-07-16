import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, mergeTrees } from '../../src/algorithms/tree/tree-merge-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-merge-2/trace.ts';
const bfs = (r: any): number[] => {
  if (!r) return [];
  const out: number[] = [];
  const q = [r];
  while (q.length) {
    const n = q.shift()!;
    out.push(n.value);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return out;
};
test('mergeTrees 正确', () => {
  assert.deepEqual(
    bfs(mergeTrees(buildTree([1, 3, 2, 5]), buildTree([2, 1, 3, null, 4, null, 7]))),
    [3, 4, 5, 5, 4, null, 7],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
