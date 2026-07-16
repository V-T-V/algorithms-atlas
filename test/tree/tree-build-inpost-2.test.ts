import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromInPost } from '../../src/algorithms/tree/tree-build-inpost-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-build-inpost-2/trace.ts';
const post = (r: any): number[] => (!r ? [] : [...post(r.left), ...post(r.right), r.value]);
test('buildFromInPost 正确', () => {
  const r = buildFromInPost([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
  assert.deepEqual(post(r), [9, 15, 7, 20, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
