import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Deque } from '../../src/algorithms/ds/dequeue-ds/impl.ts';

test('Deque 基本两端操作', () => {
  const q = new Deque(4);
  q.pushBack(1);
  q.pushBack(2);
  q.pushFront(0);
  assert.deepEqual(q.toSequence(), [0, 1, 2]);
  assert.equal(q.popFront(), 0);
  assert.equal(q.popBack(), 2);
  assert.deepEqual(q.toSequence(), [1]);
});

test('Deque 自动扩容', () => {
  const q = new Deque(2);
  q.pushBack(1);
  q.pushBack(2);
  q.pushBack(3); // 触发扩容
  assert.equal(q.size, 3);
  assert.ok(q.capacity >= 4);
  assert.deepEqual(q.toSequence(), [1, 2, 3]);
});

test('Deque 环形回绕', () => {
  const q = new Deque(4);
  q.pushBack(1);
  q.pushBack(2);
  q.pushFront(0);
  q.pushFront(-1); // head 回绕
  assert.deepEqual(q.toSequence(), [-1, 0, 1, 2]);
  q.popBack();
  q.pushFront(-2);
  assert.deepEqual(q.toSequence(), [-2, -1, 0, 1]);
});

test('Deque 出空队列返回 null', () => {
  const q = new Deque(4);
  assert.equal(q.popFront(), null);
  assert.equal(q.popBack(), null);
  q.pushBack(5);
  assert.equal(q.popFront(), 5);
  assert.equal(q.popFront(), null);
});

test('Deque 随机访问', () => {
  const q = new Deque(8);
  q.pushBack(10);
  q.pushBack(20);
  q.pushBack(30);
  assert.equal(q.get(0), 10);
  assert.equal(q.get(2), 30);
  assert.equal(q.get(3), null);
});

test('Deque 钩子被调用', () => {
  let pushes = 0;
  let pops = 0;
  let grows = 0;
  const hooks = {
    onPushBack: () => pushes++,
    onPushFront: () => pushes++,
    onPopFront: () => pops++,
    onPopBack: () => pops++,
    onGrow: () => grows++,
  };
  const q = new Deque(2);
  q.pushBack(1, hooks);
  q.pushBack(2, hooks);
  q.pushBack(3, hooks); // grow
  q.popFront(hooks);
  assert.ok(pushes >= 1, '应至少 push 一次');
  assert.ok(pops >= 1, '应至少 pop 一次');
  assert.ok(grows >= 1, '应至少扩容一次');
});
