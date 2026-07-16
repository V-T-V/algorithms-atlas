import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpuUtilization } from '../../src/algorithms/scheduling/sched-cpu-utilization/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-cpu-utilization/trace.ts';
test('cpuUtilization 正确', () => {
  const u = cpuUtilization([
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 2, burst: 3 },
    { id: 'C', arrival: 8, burst: 2 },
  ]);
  assert.ok(u > 0 && u <= 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
