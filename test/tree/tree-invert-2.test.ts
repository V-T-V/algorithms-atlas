import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, invertTree } from '../../src/algorithms/tree/tree-invert-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-invert-2/trace.ts';
const levelVals = (root: any): number[] => {
  if (!root) return [];
  const out: number[] = [];
  const q = [root];
  while (q.length) {
    const n = q.shift()!;
    out.push(n.value);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return out;
};
test('invertTree 正确', () => {
  assert.deepEqual(levelVals(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
