import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBinarySem } from '../../src/algorithms/concurrency/conc-semaphore-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-semaphore-binary/trace.ts';

test('binary sem 互斥', () => {
  const steps = simulateBinarySem([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.equal(steps[1]!.value, 0);
  assert.equal(steps[1]!.holder, 0);
  assert.deepEqual(steps[1]!.waiters, [1]);
});
test('binary sem signal 唤醒等待者', () => {
  const steps = simulateBinarySem([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 0, action: 'signal' },
  ]);
  assert.equal(steps[2]!.holder, 1);
});
test('binary sem trace 非空', () => assert.ok(buildTrace().length > 0));
