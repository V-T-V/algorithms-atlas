import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeMetrics } from '../../src/algorithms/scheduling/sched-metrics/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-metrics/trace.ts';
test('computeMetrics 正确', () => {
  const ms = computeMetrics(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    [
      { id: 'A', start: 0, end: 3 },
      { id: 'B', start: 3, end: 5 },
    ],
  );
  assert.equal(ms[0]!.wait, 0);
  assert.equal(ms[1]!.wait, 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
