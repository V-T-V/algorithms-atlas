import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CircularLinkedList,
  circularLinkedList,
} from '../../src/algorithms/ds/circular-linked-list/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/circular-linked-list/trace.ts';

test('circular-linked-list 便利函数正序', () => {
  assert.deepEqual(circularLinkedList([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(circularLinkedList([]), []);
  assert.deepEqual(circularLinkedList([42]), [42]);
});

test('circular-linked-list 尾插 O(1) 且 head = tail.next', () => {
  const list = new CircularLinkedList();
  list.insert(1);
  list.insert(2);
  list.insert(3);
  assert.equal(list.size, 3);
  assert.deepEqual(list.toArray(), [1, 2, 3]);
  assert.equal(list.headValue(), 1); // head
  // 单节点自指成环
  const single = new CircularLinkedList();
  single.insert(99);
  assert.equal(single.headValue(), 99);
  assert.deepEqual(single.toArray(), [99]);
});

test('circular-linked-list 约瑟夫环 n=7,k=3 经典序列', () => {
  const list = new CircularLinkedList();
  for (let v = 1; v <= 7; v++) list.insert(v);
  const out = list.josephus(3);
  assert.deepEqual(out, [3, 6, 2, 7, 5, 1, 4]);
  assert.equal(list.isEmpty(), true);
  assert.equal(list.size, 0);
});

test('circular-linked-list 约瑟夫环 n=5,k=2', () => {
  const list = new CircularLinkedList();
  for (let v = 1; v <= 5; v++) list.insert(v);
  const out = list.josephus(2);
  assert.deepEqual(out, [2, 4, 1, 5, 3]);
});

test('circular-linked-list 约瑟夫环 k=1 全部按序出环', () => {
  const list = new CircularLinkedList();
  for (let v = 1; v <= 4; v++) list.insert(v);
  assert.deepEqual(list.josephus(1), [1, 2, 3, 4]);
});

test('circular-linked-list 约瑟夫环空表 / 非法步数', () => {
  const list = new CircularLinkedList();
  assert.deepEqual(list.josephus(3), []);
  list.insert(1);
  assert.deepEqual(list.josephus(0), []); // step < 1 直接返回空
  assert.equal(list.size, 1); // 未被破坏
});

test('circular-linked-list 钩子被调用', () => {
  let inserts = 0;
  let removes = 0;
  const list = new CircularLinkedList();
  for (let v = 1; v <= 3; v++) list.insert(v, { onInsert: () => inserts++ });
  list.josephus(2, {
    onVisit: () => {},
    onRemove: () => removes++,
  });
  assert.equal(inserts, 3);
  assert.equal(removes, 3);
});

test('circular-linked-list buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
