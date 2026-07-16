import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTimePriority } from '../../src/algorithms/concurrency/conc-time-priority-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-time-priority-lock/trace.ts';

test('时间优先：先等者先得', () => {
  const steps = simulateTimePriority([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  // T1 应该是新的 holder
  assert.equal(steps[3]!.holder, 1);
});
test('时间优先 trace 非空', () => assert.ok(buildTrace().length > 0));
