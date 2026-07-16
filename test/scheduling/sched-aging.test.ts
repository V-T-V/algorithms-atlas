import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityWithAging } from '../../src/algorithms/scheduling/sched-aging/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-aging/trace.ts';
test('priorityWithAging 正确', () => {
  const r = priorityWithAging(
    [
      { id: 'A', arrival: 0, burst: 2, priority: 1 },
      { id: 'B', arrival: 0, burst: 1, priority: 1 },
    ],
    2,
  );
  assert.equal(r.order.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
