import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mlfq } from '../../src/algorithms/scheduling/sched-multilevel-feedback/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multilevel-feedback/trace.ts';
test('mlfq 正确', () => {
  const r = mlfq(
    [
      { id: 'A', arrival: 0, burst: 8 },
      { id: 'B', arrival: 0, burst: 4 },
      { id: 'C', arrival: 0, burst: 2 },
    ],
    [2, 4, 6],
  );
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
