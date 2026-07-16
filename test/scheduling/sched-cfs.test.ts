import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfs } from '../../src/algorithms/scheduling/sched-cfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-cfs/trace.ts';
test('cfs 正确', () => {
  const r = cfs([
    { id: 'A', arrival: 0, burst: 3, weight: 1 },
    { id: 'B', arrival: 0, burst: 3, weight: 1 },
  ]);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
