import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityNonPreemptive } from '../../src/algorithms/scheduling/sched-priority-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-nonpreempt/trace.ts';
test('priorityNonPreemptive 正确', () => {
  const r = priorityNonPreemptive([
    { id: 'A', arrival: 0, burst: 4, priority: 2 },
    { id: 'B', arrival: 0, burst: 3, priority: 1 },
    { id: 'C', arrival: 0, burst: 1, priority: 3 },
  ]);
  assert.deepEqual(r.order, ['B', 'A', 'C']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
