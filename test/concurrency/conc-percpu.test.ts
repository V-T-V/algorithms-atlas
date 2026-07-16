import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulatePerCpu } from '../../src/algorithms/concurrency/conc-percpu/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-percpu/trace.ts';

test('percpu 累加', () => {
  const steps = simulatePerCpu(2, [
    { cpu: 0, action: 'inc' },
    { cpu: 1, action: 'inc', delta: 3 },
  ]);
  assert.deepEqual(steps[1]!.perCpu, [1, 3]);
});
test('percpu trace 非空', () => assert.ok(buildTrace().length > 0));
