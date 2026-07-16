import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, flatten } from '../../src/algorithms/tree/tree-flatten-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-flatten-2/trace.ts';
test('flatten 正确', () => {
  const root = buildTree([1, 2, 5, 3, 4, null, 6]);
  flatten(root);
  const arr: number[] = [];
  let cur = root;
  while (cur) {
    arr.push(cur.value);
    cur = cur.right;
  }
  assert.deepEqual(arr, [1, 2, 3, 4, 5, 6]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
