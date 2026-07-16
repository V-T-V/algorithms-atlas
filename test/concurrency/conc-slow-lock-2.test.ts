import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSlowLock } from '../../src/algorithms/concurrency/conc-slow-lock-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-slow-lock-2/trace.ts';

test('slow lock FIFO', () => {
  const steps = simulateSlowLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[2]!.holder, 1);
});
test('slow lock trace 非空', () => assert.ok(buildTrace().length > 0));
