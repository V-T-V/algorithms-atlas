import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseList,
  reverseListRecursive,
} from '../../src/algorithms/list/reverse-list/impl.ts';

test('reverseList 迭代版', () => {
  assert.deepEqual(listToArray(reverseList(buildList([]))), []);
  assert.deepEqual(listToArray(reverseList(buildList([1]))), [1]);
  assert.deepEqual(listToArray(reverseList(buildList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
});

test('reverseList 递归版结果与迭代版一致', () => {
  const input = [1, 2, 3, 4, 5, 6];
  const iter = listToArray(reverseList(buildList(input)));
  const rec = listToArray(reverseListRecursive(buildList(input)));
  assert.deepEqual(iter, [6, 5, 4, 3, 2, 1]);
  assert.deepEqual(rec, iter);
});

test('reverseList 钩子被调用', () => {
  let flips = 0;
  let doneHead: number | null = null;
  const head = buildList([1, 2, 3]);
  reverseList(head, {
    onFlip: () => flips++,
    onDone: (h) => {
      doneHead = h ? h.value : null;
    },
  });
  assert.equal(flips, 3, 'n 个节点应翻转 n 次');
  assert.equal(doneHead, 3, '反转后头节点应为原尾节点 3');
});

test('reverseList 不改变原值数组语义', () => {
  const arr = [3, 1, 2];
  const out = listToArray(reverseList(buildList(arr)));
  assert.deepEqual(out, [2, 1, 3]);
  assert.deepEqual(arr, [3, 1, 2], '原数值数组不应被修改');
});
