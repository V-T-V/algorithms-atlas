import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  strideSchedule,
  type StrideTask,
} from '../../src/algorithms/scheduling/sched-stride-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-stride-2/trace.ts';

test('sched-stride-2：等权任务交替获得 CPU（公平性）', () => {
  const tasks: StrideTask[] = [
    { pid: 'A', burst: 3, weight: 1 },
    { pid: 'B', burst: 3, weight: 1 },
  ];
  const { timeline, cpuTime } = strideSchedule(tasks, 20);
  assert.equal(cpuTime.A, 3);
  assert.equal(cpuTime.B, 3);
  // 等权时应交替：A,B,A,B,...
  assert.equal(timeline[0]!.pid, 'A');
  assert.equal(timeline[1]!.pid, 'B');
  assert.equal(timeline[2]!.pid, 'A');
});

test('sched-stride-2：高权重任务在早期获得更多 CPU（确定性比例）', () => {
  // 权重 1:3，给充足 burst，前若干步中 B 应被选中次数更多
  const tasks: StrideTask[] = [
    { pid: 'A', burst: 20, weight: 1 },
    { pid: 'B', burst: 20, weight: 3 },
  ];
  const { timeline } = strideSchedule(tasks, 8);
  const bCount = timeline.filter((t) => t.pid === 'B').length;
  const aCount = timeline.filter((t) => t.pid === 'A').length;
  assert.ok(bCount > aCount, `高权重 B 应更频繁被选中（B=${bCount}, A=${aCount}）`);
});

test('sched-stride-2：完成时 completion 记录完成步', () => {
  const tasks: StrideTask[] = [
    { pid: 'A', burst: 2, weight: 1 },
    { pid: 'B', burst: 2, weight: 1 },
  ];
  const { completion } = strideSchedule(tasks, 20);
  assert.ok(completion.A > 0);
  assert.ok(completion.B > 0);
  assert.ok(completion.A <= 4);
});

test('sched-stride-2：onPick 钩子每次选中触发', () => {
  const tasks: StrideTask[] = [
    { pid: 'A', burst: 1, weight: 1 },
    { pid: 'B', burst: 1, weight: 1 },
  ];
  const picks: string[] = [];
  strideSchedule(tasks, 10, 10000, { onPick: (pid) => picks.push(pid) });
  assert.equal(picks.length, 2);
});

test('sched-stride-2：空任务列表安全返回', () => {
  const { completion, cpuTime, timeline } = strideSchedule([], 10);
  assert.deepEqual(completion, {});
  assert.deepEqual(cpuTime, {});
  assert.equal(timeline.length, 0);
});

test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
