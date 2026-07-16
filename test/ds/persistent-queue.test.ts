import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PersistentQueue } from '../../src/algorithms/ds/persistent-queue/impl.ts';

test('PersistentQueue FIFO 顺序', () => {
  let q = PersistentQueue.empty();
  q = q.enqueue(1);
  q = q.enqueue(2);
  q = q.enqueue(3);
  assert.deepEqual(q.toArray(), [1, 2, 3]);
  const r1 = q.dequeue();
  assert.equal(r1?.value, 1);
  q = r1!.rest;
  assert.deepEqual(q.toArray(), [2, 3]);
});

test('PersistentQueue 旧版本不可变', () => {
  const q0 = PersistentQueue.empty().enqueue(1);
  const q1 = q0.enqueue(2);
  const q2 = q1.enqueue(3);
  // q0 仍是 [1]
  assert.deepEqual(q0.toArray(), [1]);
  assert.deepEqual(q1.toArray(), [1, 2]);
  assert.deepEqual(q2.toArray(), [1, 2, 3]);
});

test('PersistentQueue 出队返回新版本、原版本不变', () => {
  const q0 = PersistentQueue.empty().enqueue(1).enqueue(2);
  const r = q0.dequeue();
  assert.equal(r!.value, 1);
  const q1 = r!.rest;
  assert.deepEqual(q0.toArray(), [1, 2]); // 原版本不变
  assert.deepEqual(q1.toArray(), [2]);
});

test('PersistentQueue peek 不移除', () => {
  const q = PersistentQueue.empty().enqueue(5).enqueue(6);
  assert.equal(q.peek(), 5);
  assert.equal(q.length, 2);
});

test('PersistentQueue 空队列出队返回 null', () => {
  const q = PersistentQueue.empty();
  assert.equal(q.dequeue(), null);
  assert.equal(q.peek(), null);
  assert.equal(q.isEmpty(), true);
});

test('PersistentQueue 连续入队后顺序出队', () => {
  let q = PersistentQueue.empty();
  for (let i = 1; i <= 5; i++) q = q.enqueue(i);
  const out: number[] = [];
  while (!q.isEmpty()) {
    const r = q.dequeue()!;
    out.push(r.value);
    q = r.rest;
  }
  assert.deepEqual(out, [1, 2, 3, 4, 5]);
});

test('PersistentQueue 钩子被调用', () => {
  let enqs = 0;
  let deqs = 0;
  let reverses = 0;
  let q = PersistentQueue.empty();
  q = q.enqueue(1, { onEnqueue: () => enqs++ });
  q = q.enqueue(2, { onEnqueue: () => enqs++ });
  const r = q.dequeue({ onDequeue: () => deqs++, onReverse: () => reverses++ });
  q = r!.rest;
  assert.ok(enqs >= 1, '应至少入队一次');
  assert.ok(deqs >= 1, '应至少出队一次');
  assert.ok(reverses >= 1, '出队时应触发一次倾倒');
});
