import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lottery } from '../../src/algorithms/scheduling/sched-llottery/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-llottery/trace.ts';
test('lottery 正确', () => {
  const r = lottery([
    { id: 'A', arrival: 0, burst: 3, tickets: 5 },
    { id: 'B', arrival: 0, burst: 2, tickets: 3 },
  ]);
  assert.equal(r.order.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
