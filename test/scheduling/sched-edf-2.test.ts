import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edfSchedule } from '../../src/algorithms/scheduling/sched-edf-2/impl.ts';

test('edfSchedule 可调度', () => {
  const r = edfSchedule([
    { pid: 'J1', arrival: 0, execution: 2, deadline: 4 },
    { pid: 'J2', arrival: 0, execution: 2, deadline: 6 },
  ]);
  assert.equal(r.allDeadlinesMet, true);
  assert.equal(r.completion.J1, 2);
  assert.equal(r.completion.J2, 4);
});

test('edfSchedule 截止更早先运行', () => {
  const r = edfSchedule([
    { pid: 'A', arrival: 0, execution: 3, deadline: 10 },
    { pid: 'B', arrival: 1, execution: 1, deadline: 3 },
  ]);
  // A 跑 0-1；B t=1 到达 deadline=3 更早，抢占 A，跑 1-2 完成；A 跑 2-4
  assert.equal(r.completion.B, 2);
  assert.equal(r.completion.A, 4);
});

test('edfSchedule 不可调度检测', () => {
  const r = edfSchedule([{ pid: 'X', arrival: 0, execution: 5, deadline: 3 }]);
  assert.equal(r.allDeadlinesMet, false);
});

test('edfSchedule 钩子', () => {
  let dispatches = 0;
  edfSchedule([{ pid: 'A', arrival: 0, execution: 2, deadline: 5 }], {
    onDispatch: () => dispatches++,
  });
  assert.ok(dispatches >= 1);
});
