import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircularQueue, circularQueue } from '../../src/algorithms/ds/circular-queue/impl.ts';

test('circular-queue 基本入队出队（FIFO）', () => {
  const q = new CircularQueue(5);
  assert.equal(q.isEmpty(), true);
  assert.equal(q.enqueue(1), true);
  assert.equal(q.enqueue(2), true);
  assert.equal(q.enqueue(3), true);
  assert.equal(q.size, 3);
  assert.equal(q.dequeue(), 1);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), undefined); // 空
  assert.equal(q.isEmpty(), true);
});

test('circular-queue 队满拒绝入队', () => {
  const q = new CircularQueue(3);
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  assert.equal(q.isFull(), true);
  assert.equal(q.enqueue(4), false); // 满，拒绝
  assert.equal(q.size, 3);
  assert.equal(q.peekFront(), 1);
});

test('circular-queue 环绕正确（关键）', () => {
  const q = new CircularQueue(3);
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  q.dequeue(); // 出 1，front→1
  q.dequeue(); // 出 2，front→2
  // 此时 rear 在 0（已环绕），front 在 2
  assert.equal(q.enqueue(4), true); // 写 data[0]
  assert.equal(q.enqueue(5), true); // 写 data[1]
  assert.equal(q.isFull(), true);
  // 出队顺序应是 3, 4, 5
  assert.deepEqual(q.toSequence(), [3, 4, 5]);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), 4);
  assert.equal(q.dequeue(), 5);
});

test('circular-queue peekFront / peekRear', () => {
  const q = new CircularQueue(4);
  assert.equal(q.peekFront(), undefined);
  assert.equal(q.peekRear(), undefined);
  q.enqueue(10);
  q.enqueue(20);
  q.enqueue(30);
  assert.equal(q.peekFront(), 10);
  assert.equal(q.peekRear(), 30);
  q.dequeue();
  assert.equal(q.peekFront(), 20);
  assert.equal(q.peekRear(), 30);
});

test('circular-queue 单容量', () => {
  const q = new CircularQueue(1);
  assert.equal(q.enqueue(7), true);
  assert.equal(q.isFull(), true);
  assert.equal(q.enqueue(8), false);
  assert.equal(q.peekFront(), 7);
  assert.equal(q.peekRear(), 7);
  assert.equal(q.dequeue(), 7);
  assert.equal(q.isEmpty(), true);
});

test('circular-queue 循环复用：入一出多轮环绕', () => {
  // 容量 3。模式：enq, enq, deq（净增 1/轮），直到满；之后 enq 出错。
  // 这里改为严格交替：enq 一个，deq 一个，重复很多次，验证 FIFO 与环绕。
  const q = new CircularQueue(3);
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  // 现已满。接下来「出 1 个，入 1 个」反复，应总能成功且队首循环更新。
  for (let i = 4; i <= 100; i++) {
    const out = q.dequeue();
    assert.equal(out, i - 3, `第 ${i} 轮出队应为 ${i - 3}`);
    assert.equal(q.enqueue(i), true, `第 ${i} 轮入队应成功`);
    assert.equal(q.isFull(), true, `应始终保持满`);
  }
  // 全部出空，顺序应为 98,99,100
  assert.equal(q.dequeue(), 98);
  assert.equal(q.dequeue(), 99);
  assert.equal(q.dequeue(), 100);
  assert.equal(q.isEmpty(), true);
});

test('circular-queue toSequence 不修改队列', () => {
  const q = new CircularQueue(4);
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  assert.deepEqual(q.toSequence(), [1, 2, 3]);
  assert.equal(q.size, 3);
  assert.equal(q.dequeue(), 1);
  assert.deepEqual(q.toSequence(), [2, 3]);
});

test('circular-queue 便利函数 circularQueue', () => {
  // ops: enq 1, enq 2, deq(1), enq 3, deq(2) → 剩 [3]
  const q = circularQueue(3, [1, 2, null, 3, null]);
  assert.deepEqual(q.toSequence(), [3]);
});

test('circular-queue 钩子被调用', () => {
  const enqueues: Array<[number, number]> = [];
  const dequeues: Array<[number, number]> = [];
  const q = new CircularQueue(5);
  q.enqueue(10, { onEnqueue: (idx, v) => enqueues.push([idx, v]) });
  q.enqueue(20, { onEnqueue: (idx, v) => enqueues.push([idx, v]) });
  q.dequeue({ onDequeue: (idx, v) => dequeues.push([idx, v]) });
  assert.deepEqual(enqueues, [
    [0, 10],
    [1, 20],
  ]);
  assert.deepEqual(dequeues, [[0, 10]]);
});

test('circular-queue onState 反映 front/rear/count', () => {
  let lastState = { front: -1, rear: -1, count: -1 };
  const q = new CircularQueue(3);
  q.enqueue(1, {
    onState: (front, rear, count) => {
      lastState = { front, rear, count };
    },
  });
  assert.deepEqual(lastState, { front: 0, rear: 1, count: 1 });
});
