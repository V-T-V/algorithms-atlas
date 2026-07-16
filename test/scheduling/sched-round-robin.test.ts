import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobin } from '../../src/algorithms/scheduling/sched-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-round-robin/trace.ts';
test('roundRobin 正确', () => {
  const r = roundRobin(
    [
      { id: 'A', arrival: 0, burst: 5 },
      { id: 'B', arrival: 0, burst: 3 },
      { id: 'C', arrival: 0, burst: 1 },
    ],
    2,
  );
  assert.ok(r.segments.length >= 3);
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
