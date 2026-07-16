import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strideScheduling } from '../../src/algorithms/scheduling/sched-fair-scheduling-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-fair-scheduling-2/trace.ts';

test('sched-fair-scheduling-2 按权重分配', () => {
  const tasks = [
    { id: 'A', weight: 3, tickets: 6 },
    { id: 'B', weight: 1, tickets: 2 },
  ];
  const res = strideScheduling(tasks);
  // 比例应约为 3:1，总共 8 步
  assert.equal(res.order.length, 8);
  assert.equal(res.allocation.A, 6);
  assert.equal(res.allocation.B, 2);
});

test('sched-fair-scheduling-2 第一步选 pass 最小', () => {
  const tasks = [
    { id: 'A', weight: 1, tickets: 1 },
    { id: 'B', weight: 1, tickets: 1 },
  ];
  const res = strideScheduling(tasks);
  assert.equal(res.order[0], 'A'); // 平手取字典序最小
});

test('sched-fair-scheduling-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
