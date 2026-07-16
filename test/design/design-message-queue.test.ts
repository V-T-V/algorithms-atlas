import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MessageQueue } from '../../src/algorithms/design/design-message-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-message-queue/trace.ts';

test('mq FIFO 顺序', () => {
  const mq = new MessageQueue<string>();
  mq.enqueue('a');
  mq.enqueue('b');
  mq.enqueue('c');
  assert.equal(mq.dequeue(), 'a');
  assert.equal(mq.dequeue(), 'b');
  assert.equal(mq.dequeue(), 'c');
  assert.equal(mq.dequeue(), undefined);
});
test('mq size 跟踪', () => {
  const mq = new MessageQueue<number>();
  mq.enqueue(1);
  mq.enqueue(2);
  assert.equal(mq.size, 2);
  mq.dequeue();
  assert.equal(mq.size, 1);
});
test('mq trace 非空', () => assert.ok(buildTrace().length > 0));
