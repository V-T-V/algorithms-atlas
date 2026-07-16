import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityPreemptive } from '../../src/algorithms/scheduling/sched-priority-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-preempt/trace.ts';
test('priorityPreemptive 正确', () => {
  const r = priorityPreemptive([
    { id: 'A', arrival: 0, burst: 4, priority: 2 },
    { id: 'B', arrival: 1, burst: 3, priority: 1 },
    { id: 'C', arrival: 2, burst: 1, priority: 3 },
  ]);
  assert.ok(r.segments.length >= 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
