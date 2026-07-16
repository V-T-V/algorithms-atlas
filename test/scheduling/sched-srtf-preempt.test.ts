import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srtf } from '../../src/algorithms/scheduling/sched-srtf-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-srtf-preempt/trace.ts';
test('srtf 正确', () => {
  const r = srtf([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 1, burst: 3 },
    { id: 'C', arrival: 2, burst: 1 },
  ]);
  assert.deepEqual(r.order, ['A', 'C', 'B', 'A']);
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
