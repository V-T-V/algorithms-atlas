import { test } from 'node:test';
import assert from 'node:assert/strict';
import { turnaroundTimes } from '../../src/algorithms/scheduling/sched-turnaround-time/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-turnaround-time/trace.ts';
test('turnaroundTimes 正确', () => {
  const ts = turnaroundTimes(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    new Map([
      ['A', 3],
      ['B', 5],
    ]),
  );
  assert.equal(ts.get('A'), 3);
  assert.equal(ts.get('B'), 5);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
