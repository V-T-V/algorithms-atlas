import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lptSchedule } from '../../src/algorithms/greedy/greedy-load-balance-lpt/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-load-balance-lpt/trace.ts';
test('LPT 负载均衡', () => {
  const r = lptSchedule([8, 7, 6, 5, 4, 3], 3);
  assert.ok(r.makespan >= 11);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
