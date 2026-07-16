import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateAsyncQueue } from '../../src/algorithms/concurrency/conc-async-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-async-queue/trace.ts';

test('async queue 空时 dequeue 等待', () => {
  const steps = simulateAsyncQueue([{ thread: 0, action: 'dequeue' }]);
  assert.deepEqual(steps[0]!.waiters, [0]);
});
test('async queue 入队唤醒等待者', () => {
  const steps = simulateAsyncQueue([
    { thread: 0, action: 'dequeue' },
    { thread: 1, action: 'enqueue', value: 5 },
  ]);
  assert.deepEqual(steps[1]!.waiters, []);
  assert.deepEqual(steps[1]!.queue, []);
});
test('async queue trace 非空', () => assert.ok(buildTrace().length > 0));
