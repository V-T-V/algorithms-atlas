import { test } from 'node:test';
import assert from 'node:assert/strict';
import { llf } from '../../src/algorithms/scheduling/sched-llf/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-llf/trace.ts';
test('llf 正确', () => {
  const { order, missed } = llf([
    { id: 'A', arrival: 0, burst: 2, deadline: 5 },
    { id: 'B', arrival: 0, burst: 3, deadline: 6 },
  ]);
  assert.ok(order.length >= 2);
  assert.equal(missed, 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
