import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sjfPreemptive } from '../../src/algorithms/scheduling/sched-sjf-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-preempt/trace.ts';
test('sjfPreemptive 正确', () => {
  const r = sjfPreemptive([
    { id: 'A', arrival: 0, burst: 7 },
    { id: 'B', arrival: 2, burst: 4 },
    { id: 'C', arrival: 4, burst: 1 },
  ]);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
