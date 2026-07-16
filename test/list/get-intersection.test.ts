import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildIntersecting,
  getIntersection,
  buildList,
} from '../../src/algorithms/list/get-intersection/impl.ts';

test('getIntersection 相交', () => {
  // listA: 4->1->(8->4->5), listB: 5->6->1->(8->4->5)
  const { headA, headB } = buildIntersecting([4, 1], [5, 6, 1], [8, 4, 5]);
  const node = getIntersection(headA, headB);
  assert.ok(node !== null);
  assert.equal(node!.value, 8);
});

test('getIntersection 不相交', () => {
  const a = buildList([1, 2, 3]);
  const b = buildList([4, 5, 6]);
  assert.equal(getIntersection(a, b), null);
});

test('getIntersection 共享为空', () => {
  const { headA, headB } = buildIntersecting([1, 2], [3], []);
  assert.equal(getIntersection(headA, headB), null);
});

test('getIntersection 钩子', () => {
  const { headA, headB } = buildIntersecting([4, 1], [5, 6, 1], [8, 4, 5]);
  let steps = 0;
  getIntersection(headA, headB, { onStep: () => steps++ });
  assert.ok(steps > 0);
});
