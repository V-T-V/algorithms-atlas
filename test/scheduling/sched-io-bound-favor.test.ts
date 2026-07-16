import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ioBoundFavor } from '../../src/algorithms/scheduling/sched-io-bound-favor/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-io-bound-favor/trace.ts';
test('ioBoundFavor 正确', () => {
  const r = ioBoundFavor([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 1 },
    { id: 'C', arrival: 0, burst: 2 },
  ]);
  assert.deepEqual(r.order, ['B', 'C', 'A']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
