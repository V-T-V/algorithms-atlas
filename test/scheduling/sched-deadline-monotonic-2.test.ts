import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadlineMonotonicRta } from '../../src/algorithms/scheduling/sched-deadline-monotonic-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-deadline-monotonic-2/trace.ts';

test('sched-deadline-monotonic-2 优先级按 D 升序', () => {
  const tasks = [
    { id: 'A', period: 10, execution: 1, deadline: 8 },
    { id: 'B', period: 10, execution: 1, deadline: 3 },
  ];
  const res = deadlineMonotonicRta(tasks);
  // B 的 D 较小，优先级 1
  const b = res.tasks.find((t) => t.id === 'B')!;
  assert.equal(b.priority, 1);
});

test('sched-deadline-monotonic-2 单任务响应时间 = C', () => {
  const tasks = [{ id: 'T', period: 10, execution: 3, deadline: 5 }];
  const res = deadlineMonotonicRta(tasks);
  assert.equal(res.tasks[0]!.responseTime, 3);
});

test('sched-deadline-monotonic-2 利用率低时可调度', () => {
  const tasks = [
    { id: 'T1', period: 8, execution: 1, deadline: 4 },
    { id: 'T2', period: 10, execution: 2, deadline: 6 },
  ];
  const res = deadlineMonotonicRta(tasks);
  assert.equal(res.allSchedulable, true);
});

test('sched-deadline-monotonic-2 超截止期不可调度', () => {
  const tasks = [{ id: 'T1', period: 4, execution: 3, deadline: 2 }];
  const res = deadlineMonotonicRta(tasks);
  assert.equal(res.allSchedulable, false);
});

test('sched-deadline-monotonic-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
