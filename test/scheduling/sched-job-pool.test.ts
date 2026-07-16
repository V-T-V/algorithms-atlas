import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobPool, Policies } from '../../src/algorithms/scheduling/sched-job-pool/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-job-pool/trace.ts';
test('jobPool sjf 正确', () => {
  const r = jobPool(
    [
      { id: 'A', arrival: 0, burst: 4 },
      { id: 'B', arrival: 0, burst: 2 },
      { id: 'C', arrival: 0, burst: 3 },
    ],
    Policies.sjf!,
  );
  assert.deepEqual(r.order, ['B', 'C', 'A']);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
