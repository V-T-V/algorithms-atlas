import { test } from 'node:test';
import assert from 'node:assert/strict';
import { responseTimeAnalysis } from '../../src/algorithms/scheduling/sched-rate-monotonic-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-rate-monotonic-2/trace.ts';

test('sched-rate-monotonic-2 利用率低时可调度', () => {
  const tasks = [
    { id: 'T1', period: 4, execution: 1, deadline: 4 },
    { id: 'T2', period: 6, execution: 2, deadline: 6 },
  ];
  const res = responseTimeAnalysis(tasks);
  assert.ok(res.utilization <= 1);
  assert.equal(res.allSchedulable, true);
});

test('sched-rate-monotonic-2 单任务响应时间等于执行时间', () => {
  const tasks = [{ id: 'T', period: 10, execution: 3, deadline: 10 }];
  const res = responseTimeAnalysis(tasks);
  assert.equal(res.tasks[0]!.responseTime, 3);
});

test('sched-rate-monotonic-2 高优先级干扰低优先级', () => {
  const tasks = [
    { id: 'HI', period: 4, execution: 2, deadline: 4 },
    { id: 'LO', period: 10, execution: 4, deadline: 10 },
  ];
  const res = responseTimeAnalysis(tasks);
  const lo = res.tasks.find((t) => t.id === 'LO')!;
  // LO 的 R = 4 + ceil(R/4)*2，迭代：4→6→8→8
  assert.ok(lo.responseTime >= 8);
});

test('sched-rate-monotonic-2 超载不可调度', () => {
  const tasks = [
    { id: 'T1', period: 2, execution: 1, deadline: 2 },
    { id: 'T2', period: 2, execution: 1, deadline: 2 },
    { id: 'T3', period: 2, execution: 1, deadline: 2 },
  ];
  const res = responseTimeAnalysis(tasks);
  assert.equal(res.allSchedulable, false);
});

test('sched-rate-monotonic-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
