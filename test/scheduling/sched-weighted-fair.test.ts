import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedFairQueue } from '../../src/algorithms/scheduling/sched-weighted-fair/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-weighted-fair/trace.ts';
test('weightedFairQueue 正确', () => {
  const order = weightedFairQueue([
    { id: 'A', arrival: 0, burst: 4, weight: 2 },
    { id: 'B', arrival: 0, burst: 4, weight: 1 },
  ]);
  assert.equal(order.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
