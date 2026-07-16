import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listSchedule } from '../../src/algorithms/greedy/greedy-list-schedule/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-list-schedule/trace.ts';
test('makespan 至少最大任务', () => {
  const r = listSchedule([3, 5, 2, 8], [0, 1, 2, 3], 2);
  assert.ok(r.makespan >= 8);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
