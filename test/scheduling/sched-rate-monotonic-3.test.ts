import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rmsSchedule,
  type RmsTask,
} from '../../src/algorithms/scheduling/sched-rate-monotonic-3/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-rate-monotonic-3/trace.ts';

test('sched-rate-monotonic-3：可调度任务集满足所有截止时间', () => {
  // 经典 RM：U = 1/8 + 1/6 + 1/4 < 利用率上界，可调度
  const tasks: RmsTask[] = [
    { pid: 'A', period: 8, execution: 1 },
    { pid: 'B', period: 6, execution: 1 },
    { pid: 'C', period: 4, execution: 1 },
  ];
  const { allDeadlinesMet, jobsCompleted } = rmsSchedule(tasks, 24);
  assert.equal(allDeadlinesMet, true);
  assert.ok(jobsCompleted > 0);
});

test('sched-rate-monotonic-3：周期越短优先级越高', () => {
  // C 周期最短，时间 0 应先被选中（内部按 period 升序）
  const tasks: RmsTask[] = [
    { pid: 'A', period: 10, execution: 1 },
    { pid: 'B', period: 4, execution: 1 },
  ];
  const r = rmsSchedule(tasks, 8);
  assert.ok(r.allDeadlinesMet);
  // 时间线按 sorted 顺序，B 在前
  assert.equal(r.timeline[0]!.pid, 'B');
});

test('sched-rate-monotonic-3：过载时错过截止时间', () => {
  // 执行 > 周期，必然错过
  const tasks: RmsTask[] = [{ pid: 'A', period: 2, execution: 3 }];
  const { allDeadlinesMet, jobsMissed } = rmsSchedule(tasks, 6);
  assert.equal(allDeadlinesMet, false);
  assert.ok(jobsMissed >= 1);
});

test('sched-rate-monotonic-3：onRelease 钩子在每个周期释放点触发', () => {
  const tasks: RmsTask[] = [{ pid: 'A', period: 4, execution: 1 }];
  const released: number[] = [];
  rmsSchedule(tasks, 12, { onRelease: (_pid, _job, time) => released.push(time) });
  // 初始释放 time=0，之后每 4 个单位（4, 8）
  assert.ok(released.includes(0));
  assert.ok(released.includes(4));
});

test('sched-rate-monotonic-3：空任务列表安全返回', () => {
  const r = rmsSchedule([], 10);
  assert.equal(r.allDeadlinesMet, true);
  assert.equal(r.jobsCompleted, 0);
  assert.equal(r.jobsMissed, 0);
});

test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
