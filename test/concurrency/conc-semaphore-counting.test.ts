import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCountingSem } from '../../src/algorithms/concurrency/conc-semaphore-counting/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-semaphore-counting/trace.ts';

test('counting sem 允许多个持有', () => {
  const steps = simulateCountingSem(2, [
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.equal(steps[1]!.count, 0);
  assert.deepEqual(steps[1]!.waiters, []);
});
test('counting sem 超额阻塞', () => {
  const steps = simulateCountingSem(2, [
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'wait' },
  ]);
  assert.equal(steps[2]!.count, -1);
  assert.deepEqual(steps[2]!.waiters, [2]);
});
test('counting sem trace 非空', () => assert.ok(buildTrace().length > 0));
