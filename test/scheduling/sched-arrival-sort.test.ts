import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrivalSortSchedule } from '../../src/algorithms/scheduling/sched-arrival-sort/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-arrival-sort/trace.ts';
test('arrivalSortSchedule 正确', () => {
  const r = arrivalSortSchedule([
    { id: 'C', arrival: 5, burst: 2 },
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 2, burst: 3 },
  ]);
  assert.deepEqual(r.order, ['A', 'B', 'C']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
