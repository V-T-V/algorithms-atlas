import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleCoScheduling } from '../../src/algorithms/scheduling/sched-coscheduling/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-coscheduling/trace.ts';

test('sched-coscheduling 窗按组轮转', () => {
  const tasks = [
    { id: 'a1', group: 'A', burst: 4 },
    { id: 'b1', group: 'B', burst: 4 },
  ];
  const windows = scheduleCoScheduling(tasks, 2);
  // 两组各需 2 窗，共 4 窗
  assert.equal(windows.length, 4);
  assert.equal(windows[0]!.groupId, 'A');
  assert.equal(windows[1]!.groupId, 'B');
  assert.equal(windows[2]!.groupId, 'A');
  assert.equal(windows[3]!.groupId, 'B');
});

test('sched-coscheduling 组完成后跳过', () => {
  const tasks = [
    { id: 'a1', group: 'A', burst: 1 },
    { id: 'b1', group: 'B', burst: 5 },
  ];
  const windows = scheduleCoScheduling(tasks, 2);
  // A 在第一轮用完，后续只剩 B
  const groupAWindows = windows.filter((w) => w.groupId === 'A').length;
  assert.equal(groupAWindows, 1);
});

test('sched-coscheduling 窗内多成员', () => {
  const tasks = [
    { id: 'a1', group: 'A', burst: 1 },
    { id: 'a2', group: 'A', burst: 1 },
  ];
  const windows = scheduleCoScheduling(tasks, 4);
  assert.equal(windows.length, 1);
  assert.equal(windows[0]!.members.length, 2);
});

test('sched-coscheduling trace', () => {
  assert.ok(buildTrace().length > 2);
});
