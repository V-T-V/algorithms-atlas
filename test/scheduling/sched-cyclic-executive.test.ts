import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyclicExecutive } from '../../src/algorithms/scheduling/sched-cyclic-executive/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-cyclic-executive/trace.ts';

test('sched-cyclic-executive 帧长为周期 gcd', () => {
  const tasks = [
    { id: 'T1', period: 2, execution: 1 },
    { id: 'T2', period: 4, execution: 1 },
  ];
  const res = cyclicExecutive(tasks);
  assert.equal(res.frameLength, 2);
  assert.equal(res.majorCycle, 4);
  assert.equal(res.frames.length, 2);
});

test('sched-cyclic-executive 短周期任务出现更频繁', () => {
  const tasks = [
    { id: 'FAST', period: 2, execution: 1 },
    { id: 'SLOW', period: 8, execution: 1 },
  ];
  const res = cyclicExecutive(tasks);
  const fastCount = res.frames.filter((f) => f.tasks.includes('FAST')).length;
  const slowCount = res.frames.filter((f) => f.tasks.includes('SLOW')).length;
  assert.ok(fastCount > slowCount);
});

test('sched-cyclic-executive 超载不可行', () => {
  const tasks = [
    { id: 'T1', period: 2, execution: 3 }, // 单任务就超帧长
  ];
  const res = cyclicExecutive(tasks);
  assert.equal(res.feasible, false);
});

test('sched-cyclic-executive trace', () => {
  assert.ok(buildTrace().length > 2);
});
