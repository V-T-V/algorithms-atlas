import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeDriven } from '../../src/algorithms/scheduling/sched-time-driven/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-time-driven/trace.ts';

test('sched-time-driven 任务按序填槽', () => {
  const res = timeDriven(
    [
      { id: 'T1', execution: 2 },
      { id: 'T2', execution: 3 },
    ],
    2,
    4,
  );
  assert.equal(res.slots[0]!.taskId, 'T1');
  assert.equal(res.slots[1]!.taskId, 'T2');
  assert.equal(res.slots[2]!.taskId, 'T2');
  assert.equal(res.slots[3]!.taskId, null);
});

test('sched-time-driven slack 统计正确', () => {
  const res = timeDriven([{ id: 'T1', execution: 3 }], 2, 3);
  // T1 占 2 槽：第一槽满用 2，第二槽用 1 slack 1，第三槽空闲 slack 2
  assert.equal(res.slots[0]!.slack, 0);
  assert.equal(res.slots[1]!.slack, 1);
  assert.equal(res.slots[2]!.slack, 2);
  assert.equal(res.totalSlack, 3);
});

test('sched-time-driven 超载不可行', () => {
  const res = timeDriven(
    [
      { id: 'T1', execution: 5 },
      { id: 'T2', execution: 5 },
    ],
    2,
    4,
  );
  assert.equal(res.feasible, false);
});

test('sched-time-driven trace', () => {
  assert.ok(buildTrace().length > 2);
});
