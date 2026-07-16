import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathSum, type TNode } from '../../src/algorithms/backtracking/bt-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-path-sum-2/trace.ts';
const tree: TNode = {
  val: 5,
  left: {
    val: 4,
    left: {
      val: 11,
      left: { val: 7, left: null, right: null },
      right: { val: 2, left: null, right: null },
    },
    right: null,
  },
  right: {
    val: 8,
    left: { val: 13, left: null, right: null },
    right: {
      val: 4,
      left: { val: 5, left: null, right: null },
      right: { val: 1, left: null, right: null },
    },
  },
};
test('pathSum 正确', () => {
  const r = pathSum(tree, 22);
  assert.equal(r.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
