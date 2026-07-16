import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCondVar } from '../../src/algorithms/concurrency/conc-cond-var-3/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-cond-var-3/trace.ts';

test('condvar wait 入队', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.deepEqual(steps[1]!.waiting, [0, 1]);
});
test('condvar signal 唤醒一个', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'signal' },
  ]);
  assert.deepEqual(steps[2]!.waiting, [1]);
});
test('condvar broadcast 全部唤醒', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'broadcast' },
  ]);
  assert.deepEqual(steps[1]!.waiting, []);
});
test('condvar trace 非空', () => assert.ok(buildTrace().length > 0));
