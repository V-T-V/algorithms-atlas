import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lptLoadBalance } from '../../src/algorithms/scheduling/sched-greedy-load-balance/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-greedy-load-balance/trace.ts';
test('lptLoadBalance 正确', () => {
  const loads = lptLoadBalance(
    [
      { id: 'A', arrival: 0, burst: 5 },
      { id: 'B', arrival: 0, burst: 4 },
      { id: 'C', arrival: 0, burst: 3 },
      { id: 'D', arrival: 0, burst: 2 },
    ],
    2,
  );
  assert.equal(loads.length, 2);
  assert.equal(loads[0]! + loads[1]!, 14);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
