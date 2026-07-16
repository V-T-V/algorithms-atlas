import { test } from 'node:test';
import assert from 'node:assert/strict';
import { batchSequential } from '../../src/algorithms/scheduling/sched-batch-sequential/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-batch-sequential/trace.ts';
test('batchSequential 正确', () => {
  const r = batchSequential([
    { id: 'J1', arrival: 0, burst: 5 },
    { id: 'J2', arrival: 0, burst: 3 },
  ]);
  assert.deepEqual(r.order, ['J1', 'J2']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
