import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DoublyLinkedList,
  doublyLinkedList,
} from '../../src/algorithms/ds/doubly-linked-list/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/doubly-linked-list/trace.ts';

test('doubly-linked-list 便利函数正序', () => {
  assert.deepEqual(doublyLinkedList([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(doublyLinkedList([]), []);
  assert.deepEqual(doublyLinkedList([42]), [42]);
});

test('doubly-linked-list 头插 / 尾插', () => {
  const l = new DoublyLinkedList();
  l.insertTail(1); // [1]
  l.insertTail(2); // [1,2]
  l.insertHead(0); // [0,1,2]
  l.insertTail(3); // [0,1,2,3]
  assert.deepEqual(l.toArray(), [0, 1, 2, 3]);
  assert.equal(l.size, 4);
});

test('doubly-linked-list 反向遍历正确（prev 链）', () => {
  const l = new DoublyLinkedList();
  for (const v of [1, 2, 3, 4]) l.insertTail(v); // [1,2,3,4]
  assert.deepEqual(l.toArray(), [1, 2, 3, 4]);
  assert.deepEqual(l.toArrayReverse(), [4, 3, 2, 1]);
});

test('doubly-linked-list search', () => {
  const l = new DoublyLinkedList();
  for (const v of [5, 15, 25]) l.insertTail(v);
  assert.equal(l.search(5), 0);
  assert.equal(l.search(25), 2);
  assert.equal(l.search(99), -1);
});

test('doubly-linked-list delete 头/尾/中间', () => {
  const l = new DoublyLinkedList();
  for (const v of [1, 2, 3]) l.insertTail(v); // [1,2,3]
  assert.equal(l.delete(1), true); // 删 head → [2,3]
  assert.deepEqual(l.toArray(), [2, 3]);
  assert.deepEqual(l.toArrayReverse(), [3, 2]);
  assert.equal(l.delete(3), true); // 删 tail → [2]
  assert.deepEqual(l.toArray(), [2]);
  l.insertTail(4); // [2,4]
  l.insertTail(6); // [2,4,6]
  assert.equal(l.delete(4), true); // 删中间 → [2,6]
  assert.deepEqual(l.toArray(), [2, 6]);
  assert.equal(l.delete(99), false);
});

test('doubly-linked-list 钩子被调用', () => {
  let headInserts = 0;
  let tailInserts = 0;
  let compares = 0;
  let found = -2;
  const l = new DoublyLinkedList();
  l.insertHead(1, {
    onInsert: (s) => {
      if (s === 'head') headInserts++;
    },
  });
  l.insertTail(2, {
    onInsert: (s) => {
      if (s === 'tail') tailInserts++;
    },
  });
  l.search(2, {
    onCompare: () => compares++,
    onFound: (idx) => {
      found = idx;
    },
  });
  assert.equal(headInserts, 1);
  assert.equal(tailInserts, 1);
  assert.ok(compares > 0);
  assert.equal(found, 1);
});

test('doubly-linked-list delete 钩子', () => {
  let delIdx = -1;
  const l = new DoublyLinkedList();
  for (const v of [1, 2, 3]) l.insertTail(v);
  l.delete(2, {
    onDelete: (idx) => {
      delIdx = idx;
    },
  });
  assert.equal(delIdx, 1);
});

test('doubly-linked-list buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
