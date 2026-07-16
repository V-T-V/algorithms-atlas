import { test } from 'node:test';
import assert from 'node:assert/strict';
import { periodicEdf } from '../../src/algorithms/scheduling/sched-realtime-edf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-realtime-edf-2/trace.ts';

test('sched-realtime-edf-2 利用率 ≤1 时可行', () => {
  const tasks = [
    { id: 'T1', period: 4, execution: 1, deadline: 4 },
    { id: 'T2', period: 6, execution: 2, deadline: 6 },
  ];
  const res = periodicEdf(tasks, 12);
  assert.ok(res.utilization <= 1);
  assert.equal(res.deadlineMisses, 0);
  assert.equal(res.feasible, true);
});

test('sched-realtime-edf-2 利用率 >1 时不可行', () => {
  const tasks = [
    { id: 'T1', period: 2, execution: 1, deadline: 2 },
    { id: 'T2', period: 2, execution: 1, deadline: 2 },
    { id: 'T3', period: 2, execution: 1, deadline: 2 },
  ];
  const res = periodicEdf(tasks, 6);
  assert.ok(res.utilization > 1);
  assert.ok(res.deadlineMisses > 0);
});

test('sched-realtime-edf-2 单任务总能完成', () => {
  const tasks = [{ id: 'T', period: 5, execution: 2, deadline: 5 }];
  const res = periodicEdf(tasks, 10);
  assert.equal(res.deadlineMisses, 0);
});

test('sched-realtime-edf-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
