import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityCeiling } from '../../src/algorithms/scheduling/sched-priority-ceiling/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-ceiling/trace.ts';

test('sched-priority-ceiling 天花板为使用者最高优先级', () => {
  const tasks = [
    { id: 'L', basePriority: 1 },
    { id: 'H', basePriority: 9 },
  ];
  const resources = [{ id: 'R', users: ['L', 'H'] }];
  const res = priorityCeiling(tasks, resources, []);
  assert.equal(res.ceilings.R, 9);
});

test('sched-priority-ceiling 持有者提升至天花板', () => {
  const tasks = [
    { id: 'L', basePriority: 1 },
    { id: 'H', basePriority: 9 },
  ];
  const resources = [{ id: 'R', users: ['L', 'H'] }];
  const events = [{ type: 'lock' as const, taskId: 'L', resourceId: 'R', time: 0 }];
  const res = priorityCeiling(tasks, resources, events);
  assert.equal(res.snapshots[0]!.boostedPriority, 9);
});

test('sched-priority-ceiling 释放后恢复基优先级', () => {
  const tasks = [
    { id: 'L', basePriority: 1 },
    { id: 'H', basePriority: 9 },
  ];
  const resources = [{ id: 'R', users: ['L', 'H'] }];
  const events = [
    { type: 'lock' as const, taskId: 'L', resourceId: 'R', time: 0 },
    { type: 'unlock' as const, taskId: 'L', resourceId: 'R', time: 1 },
  ];
  const res = priorityCeiling(tasks, resources, events);
  assert.equal(res.effectivePriority.L, 1);
});

test('sched-priority-ceiling 资源被持有时新请求阻塞', () => {
  const tasks = [
    { id: 'A', basePriority: 5 },
    { id: 'B', basePriority: 3 },
  ];
  const resources = [{ id: 'R', users: ['A', 'B'] }];
  const events = [
    { type: 'lock' as const, taskId: 'A', resourceId: 'R', time: 0 },
    { type: 'lock' as const, taskId: 'B', resourceId: 'R', time: 1 },
  ];
  const res = priorityCeiling(tasks, resources, events);
  assert.equal(res.blockCount, 1);
});

test('sched-priority-ceiling trace', () => {
  assert.ok(buildTrace().length > 2);
});
