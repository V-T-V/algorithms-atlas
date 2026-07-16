import { test } from 'node:test';
import assert from 'node:assert/strict';
import { throughput } from '../../src/algorithms/scheduling/sched-throughput/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-throughput/trace.ts';
test('throughput 正确', () => {
  assert.equal(
    throughput(
      [
        { id: 'A', arrival: 0, burst: 3 },
        { id: 'B', arrival: 0, burst: 2 },
      ],
      10,
    ),
    0.2,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
