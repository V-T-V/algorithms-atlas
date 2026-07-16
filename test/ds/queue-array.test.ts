import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QueueArray, queueArray } from '../../src/algorithms/ds/queue-array/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/queue-array/trace.ts';

test('queue-array FIFO 顺序', () => {
  const q = new QueueArray(8);
  for (const v of [1, 2, 3]) q.enqueue(v);
  assert.equal(q.size, 3);
  assert.equal(q.dequeue(), 1);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), undefined);
  assert.equal(q.isEmpty(), true);
});

test('queue-array peek 不取走队首', () => {
  const q = new QueueArray(8);
  q.enqueue(10);
  q.enqueue(20);
  assert.equal(q.peek(), 10);
  assert.equal(q.size, 2);
  assert.equal(q.peek(), 10);
});

test('queue-array 便利函数返回正序（FIFO）', () => {
  assert.deepEqual(queueArray([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(queueArray([]), []);
  assert.deepEqual(queueArray([42]), [42]);
});

test('queue-array 出队后整体前移（compact）保持队首在 data[0]', () => {
  const q = new QueueArray(8);
  for (const v of [1, 2, 3, 4, 5]) q.enqueue(v);
  q.dequeue();
  assert.deepEqual(q.toArray(), [2, 3, 4, 5]); // 2 现在在 data[0]
  assert.equal(q.peek(), 2);
  q.dequeue();
  assert.deepEqual(q.toArray(), [3, 4, 5]);
});

test('queue-array 扩容', () => {
  const q = new QueueArray(4);
  for (let i = 1; i <= 9; i++) q.enqueue(i);
  assert.equal(q.size, 9);
  assert.equal(q.capacity, 16);
  // 出队仍是 FIFO
  const out: number[] = [];
  while (!q.isEmpty()) out.push(q.dequeue()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('queue-array 钩子被调用（compact 计数）', () => {
  let enqueues = 0;
  let dequeues = 0;
  let totalMoved = 0;
  const q = new QueueArray(8);
  for (const v of [1, 2, 3, 4]) q.enqueue(v, { onEnqueue: () => enqueues++ });
  // 出队 2 次：第1次搬移3个，第2次搬移2个
  q.dequeue({
    onDequeue: () => dequeues++,
    onCompact: (m) => {
      totalMoved += m;
    },
  });
  q.dequeue({
    onDequeue: () => dequeues++,
    onCompact: (m) => {
      totalMoved += m;
    },
  });
  assert.equal(enqueues, 4);
  assert.equal(dequeues, 2);
  assert.equal(totalMoved, 5); // 3 + 2
});

test('queue-array 空队 dequeue 返回 undefined', () => {
  const q = new QueueArray(4);
  assert.equal(q.peek(), undefined);
  assert.equal(q.dequeue(), undefined);
  assert.equal(q.size, 0);
});

test('queue-array buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
