import { test } from 'node:test';
import assert from 'node:assert/strict';
import { taskScheduler } from '../../src/algorithms/greedy/task-scheduler/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/task-scheduler/trace.ts';

test('taskScheduler 已知值', () => {
  assert.equal(taskScheduler(['A', 'A', 'A', 'B', 'B', 'B'], 2).total, 8);
  assert.equal(taskScheduler(['A', 'A', 'A', 'B', 'B', 'B'], 0).total, 6);
  assert.equal(
    taskScheduler(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2).total,
    16,
  );
});

test('taskScheduler 单种任务', () => {
  assert.equal(taskScheduler(['A', 'A', 'A'], 2).total, 7);
});

test('taskScheduler n=0 即任务总数', () => {
  assert.equal(taskScheduler(['A', 'B', 'C'], 0).total, 3);
});

test('buildTrace 含时间', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
