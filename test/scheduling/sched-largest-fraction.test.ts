import { test } from 'node:test';
import assert from 'node:assert/strict';
import { largestFraction } from '../../src/algorithms/scheduling/sched-largest-fraction/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-largest-fraction/trace.ts';

test('sched-largest-fraction 按权重比例分配', () => {
  const tasks = [
    { id: 'A', weight: 3, demand: 6 },
    { id: 'B', weight: 1, demand: 2 },
  ];
  const res = largestFraction(tasks);
  assert.equal(res.allocation.A, 6);
  assert.equal(res.allocation.B, 2);
});

test('sched-largest-fraction 第一步选权重最大', () => {
  const tasks = [
    { id: 'A', weight: 1, demand: 1 },
    { id: 'B', weight: 5, demand: 1 },
  ];
  const res = largestFraction(tasks);
  assert.equal(res.order[0], 'B');
});

test('sched-largest-fraction trace', () => {
  assert.ok(buildTrace().length > 2);
});
