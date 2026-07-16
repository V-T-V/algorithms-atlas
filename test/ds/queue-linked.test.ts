import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QueueLinked, queueLinked } from '../../src/algorithms/ds/queue-linked/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/queue-linked/trace.ts';

test('queue-linked FIFO 顺序', () => {
  const q = new QueueLinked();
  for (const v of [1, 2, 3]) q.enqueue(v);
  assert.equal(q.size, 3);
  assert.equal(q.dequeue(), 1);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), undefined);
  assert.equal(q.isEmpty(), true);
});

test('queue-linked 便利函数返回正序（FIFO）', () => {
  assert.deepEqual(queueLinked([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(queueLinked([]), []);
  assert.deepEqual(queueLinked([42]), [42]);
});

test('queue-linked peek 不取走队首', () => {
  const q = new QueueLinked();
  q.enqueue(10);
  q.enqueue(20);
  assert.equal(q.peek(), 10);
  assert.equal(q.size, 2);
  assert.equal(q.peek(), 10);
});

test('queue-linked 出队到空后 rear 正确清空，可继续入队', () => {
  const q = new QueueLinked();
  q.enqueue(1);
  q.enqueue(2);
  assert.equal(q.dequeue(), 1);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.isEmpty(), true);
  // 重新入队，验证 rear 在取空后被正确处理
  q.enqueue(3);
  q.enqueue(4);
  assert.deepEqual(q.toArray(), [3, 4]);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), 4);
});

test('queue-linked 持续 enqueue/dequeue 保持 FIFO', () => {
  const q = new QueueLinked();
  q.enqueue(1);
  q.enqueue(2);
  assert.equal(q.dequeue(), 1);
  q.enqueue(3);
  q.enqueue(4);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), 4);
  assert.equal(q.isEmpty(), true);
});

test('queue-linked 钩子被调用', () => {
  const enq: number[] = [];
  const deq: number[] = [];
  const q = new QueueLinked();
  q.enqueue(1, { onEnqueue: (v) => enq.push(v) });
  q.enqueue(2, { onEnqueue: (v) => enq.push(v) });
  q.dequeue({ onDequeue: (v) => deq.push(v) });
  q.dequeue({ onDequeue: (v) => deq.push(v) });
  assert.deepEqual(enq, [1, 2]);
  assert.deepEqual(deq, [1, 2]);
});

test('queue-linked 空队 dequeue 返回 undefined', () => {
  const q = new QueueLinked();
  assert.equal(q.peek(), undefined);
  assert.equal(q.dequeue(), undefined);
  assert.equal(q.size, 0);
});

test('queue-linked buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
