import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multicoreFCFS } from '../../src/algorithms/scheduling/sched-multicore-fcfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multicore-fcfs/trace.ts';
test('multicoreFCFS 正确', () => {
  const loads = multicoreFCFS(
    [
      { id: 'A', arrival: 0, burst: 5 },
      { id: 'B', arrival: 0, burst: 3 },
      { id: 'C', arrival: 0, burst: 4 },
      { id: 'D', arrival: 0, burst: 2 },
    ],
    2,
  );
  assert.equal(loads[0]! + loads[1]!, 14);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
