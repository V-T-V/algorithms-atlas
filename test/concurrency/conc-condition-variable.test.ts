import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateConditionVariable } from '../../src/algorithms/concurrency/conc-condition-variable/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-condition-variable/trace.ts';

test('conc-condition-variable 空缓冲消费会等待', () => {
  const steps = simulateConditionVariable([{ thread: 1, action: 'consume' }]);
  assert.deepEqual(steps[0]!.waiting, [1]);
  assert.equal(steps[0]!.buffer.length, 0);
});

test('conc-condition-variable produce 唤醒等待者', () => {
  const steps = simulateConditionVariable([
    { thread: 1, action: 'consume' },
    { thread: 0, action: 'produce' },
  ]);
  assert.equal(steps[0]!.waiting.length, 1);
  assert.equal(steps[1]!.waiting.length, 0); // 被唤醒
  assert.equal(steps[1]!.buffer.length, 1); // 未消费（仅唤醒）
});

test('conc-condition-variable signalAll 唤醒全部', () => {
  const steps = simulateConditionVariable([
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'wait' },
    { thread: 0, action: 'signalAll' },
  ]);
  assert.equal(steps[1]!.waiting.length, 2);
  assert.equal(steps[2]!.waiting.length, 0);
});

test('conc-condition-variable trace', () => {
  assert.ok(buildTrace().length > 2);
});
