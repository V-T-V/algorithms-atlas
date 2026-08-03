import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  llfSchedule,
  type LlfTask,
} from '../../src/algorithms/scheduling/sched-llf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-llf-2/trace.ts';

test('sched-llf-2：松弛度最小的任务优先执行', () => {
  // A：到达 0，执行 2，截止 2 → 初始 laxity = 2-0-2 = 0
  // B：到达 0，执行 1，截止 5 → 初始 laxity = 5-0-1 = 4
  // A 先跑
  const tasks: LlfTask[] = [
    { pid: 'A', arrival: 0, execution: 2, deadline: 2 },
    { pid: 'B', arrival: 0, execution: 1, deadline: 5 },
  ];
  const { completion } = llfSchedule(tasks);
  // A 在 t=2 完成
  assert.equal(completion.A, 2);
});

test('sched-llf-2：满足截止时间时 allDeadlinesMet 为真', () => {
  const tasks: LlfTask[] = [
    { pid: 'A', arrival: 0, execution: 1, deadline: 5 },
    { pid: 'B', arrival: 0, execution: 1, deadline: 5 },
  ];
  const { allDeadlinesMet, completion } = llfSchedule(tasks);
  assert.equal(allDeadlinesMet, true);
  assert.equal(completion.A, 1);
  assert.equal(completion.B, 2);
});

test('sched-llf-2：错过截止时间时 allDeadlinesMet 为假', () => {
  const tasks: LlfTask[] = [
    { pid: 'A', arrival: 0, execution: 3, deadline: 2 },
  ];
  const { allDeadlinesMet, completion } = llfSchedule(tasks);
  assert.equal(allDeadlinesMet, false);
  assert.equal(completion.A, 3);
});

test('sched-llf-2：到达时间在未来的任务在到达前不被选中', () => {
  const tasks: LlfTask[] = [
    { pid: 'A', arrival: 0, execution: 1, deadline: 10 },
    { pid: 'B', arrival: 5, execution: 1, deadline: 10 },
  ];
  const { completion } = llfSchedule(tasks);
  assert.equal(completion.A, 1);
  // B 在 t>=5 才能开始，最迟 6 完成
  assert.ok(completion.B >= 6 && completion.B <= 6);
});

test('sched-llf-2：空任务列表安全返回', () => {
  const { completion, allDeadlinesMet } = llfSchedule([]);
  assert.deepEqual(completion, {});
  assert.equal(allDeadlinesMet, true);
});

test('sched-llf-2：钩子在每次分派时触发', () => {
  const tasks: LlfTask[] = [{ pid: 'A', arrival: 0, execution: 2, deadline: 10 }];
  const times: number[] = [];
  llfSchedule(tasks, { onDispatch: (_pid, time) => times.push(time) });
  assert.deepEqual(times, [0, 1]);
});

test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
