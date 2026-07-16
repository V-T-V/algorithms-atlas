import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sjfNonPreemptive } from '../../src/algorithms/scheduling/sched-sjf-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-nonpreempt/trace.ts';
test('sjfNonPreemptive 正确', () => {
  const r = sjfNonPreemptive([
    { id: 'A', arrival: 0, burst: 6 },
    { id: 'B', arrival: 1, burst: 2 },
    { id: 'C', arrival: 2, burst: 4 },
  ]);
  assert.deepEqual(r.order, ['A', 'B', 'C']);
  assert.ok(r.avgWait > 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
