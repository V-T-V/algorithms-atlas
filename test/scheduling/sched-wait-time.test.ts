import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitingTimes } from '../../src/algorithms/scheduling/sched-wait-time/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-wait-time/trace.ts';
test('waitingTimes 正确', () => {
  const ws = waitingTimes(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    new Map([
      ['A', 3],
      ['B', 5],
    ]),
  );
  assert.equal(ws.get('A'), 0);
  assert.equal(ws.get('B'), 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
