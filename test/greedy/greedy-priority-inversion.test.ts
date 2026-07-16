import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityInheritance } from '../../src/algorithms/greedy/greedy-priority-inversion/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-priority-inversion/trace.ts';
test('持锁任务被提升', () => {
  const tasks = [
    { id: 0, prio: 1, holds: 5 },
    { id: 1, prio: 5, waits: 5 },
  ];
  priorityInheritance(tasks);
  assert.ok(tasks[0]!.prio >= 5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
