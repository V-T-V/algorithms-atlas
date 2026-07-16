import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multilevelQueue } from '../../src/algorithms/scheduling/sched-multilevel-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multilevel-queue/trace.ts';
test('multilevelQueue 正确', () => {
  const r = multilevelQueue([
    { id: 'A', arrival: 0, burst: 2, priority: 0 },
    { id: 'B', arrival: 0, burst: 3, priority: 1 },
    { id: 'C', arrival: 0, burst: 1, priority: 0 },
  ]);
  assert.deepEqual(r.order, ['A', 'C', 'B']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
