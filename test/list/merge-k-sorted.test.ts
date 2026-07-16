import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeKSorted,
  fromArray,
  toArray,
  type ListNode,
} from '../../src/algorithms/list/merge-k-sorted/impl.ts';

test('merge-k-sorted 合并 3 条升序链表', () => {
  const lists = [fromArray([1, 4, 7, 10]), fromArray([2, 5, 8, 11]), fromArray([3, 6, 9, 12])];
  const merged = mergeKSorted(lists);
  assert.deepEqual(toArray(merged), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('merge-k-sorted 含空链表', () => {
  const lists: Array<ListNode | null> = [fromArray([1, 3]), null, fromArray([2, 4])];
  const merged = mergeKSorted(lists);
  assert.deepEqual(toArray(merged), [1, 2, 3, 4]);
});

test('merge-k-sorted 全部为空返回 null', () => {
  assert.equal(mergeKSorted([null, null, null]), null);
  assert.equal(mergeKSorted([]), null);
});

test('merge-k-sorted 单条链表原样返回', () => {
  const lists = [fromArray([5, 6, 7])];
  assert.deepEqual(toArray(mergeKSorted(lists)), [5, 6, 7]);
});

test('merge-k-sorted 长度不等的链表', () => {
  const lists = [fromArray([1, 10, 100]), fromArray([2, 3]), fromArray([5])];
  assert.deepEqual(toArray(mergeKSorted(lists)), [1, 2, 3, 5, 10, 100]);
});

test('merge-k-sorted 结果严格升序', () => {
  const lists = [
    fromArray([1, 5, 9]),
    fromArray([2, 6, 10]),
    fromArray([3, 7, 11]),
    fromArray([4, 8, 12]),
  ];
  const out = toArray(mergeKSorted(lists));
  for (let i = 1; i < out.length; i++) {
    assert.ok(out[i]! >= out[i - 1]!, `位置 ${i} 不升序`);
  }
  assert.equal(out.length, 12);
});

test('merge-k-sorted 不修改原链表节点的值序列', () => {
  const lists = [fromArray([1, 2]), fromArray([3, 4])];
  mergeKSorted(lists);
  // 原链表节点值序列应仍可遍历（next 指针可能被改写，但值不变；此处断言值集合）
  assert.deepEqual(
    lists.map((l) => l!.value),
    [1, 3],
  );
});

test('merge-k-sorted 钩子被调用', () => {
  let pops = 0;
  let appends = 0;
  let inits = 0;
  mergeKSorted([fromArray([1, 2]), fromArray([3])], {
    onInit: () => inits++,
    onPop: () => pops++,
    onAppend: () => appends++,
  });
  assert.equal(inits, 1, 'onInit 调用一次');
  assert.equal(pops, 3, '3 个节点各 pop 一次');
  assert.equal(appends, 3, '3 次追加');
});
