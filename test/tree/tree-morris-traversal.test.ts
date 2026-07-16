import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  morrisInorder,
  buildTree,
  cloneTree,
  treeEqual,
} from '../../src/algorithms/tree/tree-morris-traversal/impl.ts';

test('morrisInorder 中序序列', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  assert.deepEqual(morrisInorder(root), [1, 2, 3, 4, 5, 6, 7]);
});

test('morrisInorder 边界', () => {
  assert.deepEqual(morrisInorder(null), []);
  assert.deepEqual(morrisInorder(buildTree([1])), [1]);
  assert.deepEqual(morrisInorder(buildTree([2, 1])), [1, 2]);
  assert.deepEqual(morrisInorder(buildTree([1, null, 2])), [1, 2]);
});

test('morrisInorder 不破坏树结构', () => {
  const root = buildTree([4, 2, 6, 1, 3, 5, 7]);
  const before = cloneTree(root);
  morrisInorder(root);
  assert.ok(treeEqual(root, before), 'Morris 遍历后树结构应保持不变');
});

test('morrisInorder 线索建立与断开配对', () => {
  let threads = 0;
  let netZero = true;
  morrisInorder(buildTree([4, 2, 6, 1, 3, 5, 7]), {
    onThread: () => threads++,
    onUnthread: () => threads--,
  });
  if (threads !== 0) netZero = false;
  assert.ok(netZero, '线索建立与断开应配对，净值为 0');
  assert.equal(threads, 0);
});
