import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadlineMonotonic } from '../../src/algorithms/scheduling/sched-deadline-monotonic/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-deadline-monotonic/trace.ts';
test('deadlineMonotonic 正确', () => {
  const out = deadlineMonotonic([
    { id: 'A', period: 10, burst: 2, deadline: 8 },
    { id: 'B', period: 8, burst: 1, deadline: 5 },
  ]);
  assert.equal(out[0]!.id, 'B');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
