import { test } from 'node:test';
import assert from 'node:assert/strict';
import { removeNthEnd, type ListNode } from '../../src/algorithms/list/remove-nth-end/impl.ts';

function fromArray(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head: ListNode = { value: arr[0]!, next: null };
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = { value: arr[i]!, next: null };
    cur = cur.next;
  }
  return head;
}

function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

test('删除倒数第 2 个节点', () => {
  // [1,2,3,4,5] 删倒数第 2 → [1,2,3,5]
  assert.deepEqual(toArray(removeNthEnd(fromArray([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
});

test('删除头节点（倒数第 n 个恰好是头）', () => {
  assert.deepEqual(toArray(removeNthEnd(fromArray([1, 2, 3]), 3)), [2, 3]);
});

test('删除尾节点', () => {
  assert.deepEqual(toArray(removeNthEnd(fromArray([1, 2, 3]), 1)), [1, 2]);
});

test('单节点链表删除', () => {
  assert.equal(removeNthEnd(fromArray([1]), 1), null);
});

test('空链表', () => {
  assert.equal(removeNthEnd(null, 1), null);
});

test('钩子被调用', () => {
  let steps = 0;
  removeNthEnd(fromArray([1, 2, 3, 4, 5]), 2, { onStep: () => steps++ });
  assert.ok(steps > 0);
});
