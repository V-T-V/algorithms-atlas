import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rateMonotonic } from '../../src/algorithms/scheduling/sched-rate-monotonic/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-rate-monotonic/trace.ts';
test('rateMonotonic 正确', () => {
  const r = rateMonotonic([
    { id: 'A', period: 8, burst: 1 },
    { id: 'B', period: 4, burst: 1 },
  ]);
  assert.equal(r[0]!.id, 'B');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
