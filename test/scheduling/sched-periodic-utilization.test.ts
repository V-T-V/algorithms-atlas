import { test } from 'node:test';
import assert from 'node:assert/strict';
import { periodicUtilization } from '../../src/algorithms/scheduling/sched-periodic-utilization/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-periodic-utilization/trace.ts';
test('periodicUtilization 正确', () => {
  const r = periodicUtilization([
    { id: 'A', period: 4, burst: 1 },
    { id: 'B', period: 6, burst: 1 },
    { id: 'C', period: 8, burst: 1 },
  ]);
  assert.ok(r.util > 0);
  assert.ok(r.bound > 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
