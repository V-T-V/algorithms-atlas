import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTree,
  serialize,
  deserialize,
} from '../../src/algorithms/tree/tree-serialize-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-serialize-2/trace.ts';
const pre = (r: any): number[] => (!r ? [] : [r.value, ...pre(r.left), ...pre(r.right)]);
test('serialize/deserialize 互逆', () => {
  const root = buildTree([1, 2, 3, null, null, 4, 5]);
  assert.deepEqual(pre(deserialize(serialize(root))), pre(root));
  assert.equal(serialize(null), 'null');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
