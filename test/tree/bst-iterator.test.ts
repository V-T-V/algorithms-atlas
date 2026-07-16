import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BSTIterator,
  bstIterator,
  bstInsert,
} from '../../src/algorithms/tree/bst-iterator/impl.ts';

test('bst-iterator 按升序产出', () => {
  const root = bstInsert([50, 30, 70, 20, 40, 60, 80]);
  const out = bstIterator(root);
  assert.deepEqual(out, [20, 30, 40, 50, 60, 70, 80]);
});

test('bst-iterator hasNext 正确反映剩余', () => {
  const root = bstInsert([2, 1, 3]);
  const it = new BSTIterator(root);
  assert.equal(it.hasNext(), true);
  assert.equal(it.next(), 1);
  assert.equal(it.hasNext(), true);
  assert.equal(it.next(), 2);
  assert.equal(it.next(), 3);
  assert.equal(it.hasNext(), false);
});

test('bst-iterator 空树', () => {
  const it = new BSTIterator(null);
  assert.equal(it.hasNext(), false);
  assert.deepEqual(bstIterator(null), []);
});

test('bst-iterator 退化右链', () => {
  const root = bstInsert([1, 2, 3, 4]);
  assert.deepEqual(bstIterator(root), [1, 2, 3, 4]);
});

test('bst-iterator 钩子被调用 n 次', () => {
  let calls = 0;
  const root = bstInsert([5, 3, 7]);
  bstIterator(root, { onNext: () => calls++ });
  assert.equal(calls, 3);
});
