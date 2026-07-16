import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialAveraging } from '../../src/algorithms/scheduling/sched-sjf-approx/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-approx/trace.ts';
test('exponentialAveraging 正确', () => {
  const est = exponentialAveraging([{ id: 'A', bursts: [10, 6, 8, 5] }], 0.5);
  assert.ok(est.get('A')! > 0);
  assert.ok(est.get('A')! < 10);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
