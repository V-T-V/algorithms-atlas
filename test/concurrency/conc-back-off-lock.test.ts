import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBackoff } from '../../src/algorithms/concurrency/conc-back-off-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-back-off-lock/trace.ts';

test('backoff 互斥', () => {
  const steps = simulateBackoff(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[0]!.flag, 1);
  assert.equal(steps[0]!.holder, 0);
});
test('backoff 退避计数递增', () => {
  const steps = simulateBackoff(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' }, // T1 退避
  ]);
  assert.ok(steps[1]!.backoffs[1]! >= 0);
});
test('backoff trace 非空', () => assert.ok(buildTrace().length > 0));
