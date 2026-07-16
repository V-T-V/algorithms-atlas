import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityFeedback } from '../../src/algorithms/scheduling/sched-priority-feedback/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-feedback/trace.ts';
test('priorityFeedback 正确', () => {
  const r = priorityFeedback(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 3 },
    ],
    0,
  );
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
