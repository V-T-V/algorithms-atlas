import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LinkedList, linkedList } from '../../src/algorithms/ds/linked-list/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/linked-list/trace.ts';

test('linked-list 头插逆序构建', () => {
  // 头插 [1,2,3] → 链表为 [3,2,1]
  assert.deepEqual(linkedList([1, 2, 3]), [3, 2, 1]);
  assert.deepEqual(linkedList([]), []);
  assert.deepEqual(linkedList([42]), [42]);
});

test('linked-list 头插 / 尾插', () => {
  const l = new LinkedList();
  l.insertHead(1); // [1]
  l.insertHead(2); // [2,1]
  l.insertTail(3); // [2,1,3]
  assert.deepEqual(l.toArray(), [2, 1, 3]);
  assert.equal(l.size, 3);
});

test('linked-list search 返回首个命中下标', () => {
  const l = new LinkedList();
  for (const v of [10, 20, 30, 20]) l.insertTail(v); // [10,20,30,20]
  assert.equal(l.search(10), 0);
  assert.equal(l.search(20), 1); // 首个 20
  assert.equal(l.search(30), 2);
  assert.equal(l.search(99), -1);
  assert.equal(l.contains(30), true);
  assert.equal(l.contains(99), false);
});

test('linked-list delete 首个匹配', () => {
  const l = new LinkedList();
  for (const v of [10, 20, 30, 20]) l.insertTail(v); // [10,20,30,20]
  assert.equal(l.delete(20), true); // 删首个 20 → [10,30,20]
  assert.deepEqual(l.toArray(), [10, 30, 20]);
  assert.equal(l.delete(20), true); // 再删剩 20 → [10,30]
  assert.deepEqual(l.toArray(), [10, 30]);
  assert.equal(l.delete(20), false); // 无
  assert.equal(l.delete(10), true);
  assert.equal(l.delete(30), true);
  assert.equal(l.isEmpty(), true);
});

test('linked-list delete head 节点', () => {
  const l = new LinkedList();
  l.insertTail(1);
  l.insertTail(2); // [1,2]
  assert.equal(l.delete(1), true); // 删 head
  assert.deepEqual(l.toArray(), [2]);
});

test('linked-list 钩子被调用', () => {
  let inserts = 0;
  let compares = 0;
  let found = -2;
  const l = new LinkedList();
  l.insertHead(1, { onInsert: () => inserts++ });
  l.insertHead(2, { onInsert: () => inserts++ });
  l.search(1, {
    onCompare: (idx, value, hit) => {
      compares++;
      void idx;
      void value;
      void hit;
    },
    onFound: (idx) => {
      found = idx;
    },
  });
  assert.equal(inserts, 2);
  assert.ok(compares > 0);
  // 头插后 [2,1]，1 在下标 1
  assert.equal(found, 1);
});

test('linked-list delete 钩子', () => {
  let delIdx = -1;
  const l = new LinkedList();
  for (const v of [1, 2, 3]) l.insertTail(v); // [1,2,3]
  l.delete(2, {
    onDelete: (idx) => {
      delIdx = idx;
    },
  });
  assert.equal(delIdx, 1);
});

test('linked-list buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
