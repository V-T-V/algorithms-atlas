import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTasLock } from '../../src/algorithms/concurrency/conc-tas-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-tas-lock/trace.ts';

test('TAS 互斥：同时只有一个持有者', () => {
  const steps = simulateTasLock(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  // 在 T0 unlock 前，T1 不是 critical
  assert.notEqual(steps[1]!.states[1], 'critical');
  assert.equal(steps[0]!.states[0], 'critical');
});
test('TAS unlock 后 flag 归 0', () => {
  const steps = simulateTasLock(1, [
    { thread: 0, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[1]!.flag, 0);
});
test('TAS trace 非空', () => assert.ok(buildTrace().length > 0));
