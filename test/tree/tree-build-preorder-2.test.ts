import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromPreIn } from '../../src/algorithms/tree/tree-build-preorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-build-preorder-2/trace.ts';
const pre = (r: any): number[] => (!r ? [] : [r.value, ...pre(r.left), ...pre(r.right)]);
test('buildFromPreIn 正确', () => {
  const r = buildFromPreIn([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
  assert.deepEqual(pre(r), [3, 9, 20, 15, 7]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
