import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fcfsOverhead } from '../../src/algorithms/scheduling/sched-fcfs-overhead/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-fcfs-overhead/trace.ts';
test('fcfsOverhead 正确', () => {
  const r = fcfsOverhead(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    1,
  );
  assert.deepEqual(r.order, ['A', 'B']);
  assert.equal(r.segments[1]!.start, 4);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
