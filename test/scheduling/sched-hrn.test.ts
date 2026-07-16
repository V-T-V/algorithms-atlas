import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hrn } from '../../src/algorithms/scheduling/sched-hrn/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-hrn/trace.ts';
test('hrn 正确', () => {
  const r = hrn([
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 8 },
  ]);
  assert.equal(r.order[0], 'A');
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
