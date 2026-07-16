import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleMulticoreBalanced } from '../../src/algorithms/scheduling/sched-multicore-balanced/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multicore-balanced/trace.ts';

test('sched-multicore-balanced 总负载守恒', () => {
  const r = scheduleMulticoreBalanced(
    [
      { id: 'A', duration: 5 },
      { id: 'B', duration: 3 },
    ],
    2,
  );
  assert.equal(
    r.coreLoads.reduce((a, b) => a + b, 0),
    8,
  );
});

test('sched-multicore-balanced makespan 合理', () => {
  const r = scheduleMulticoreBalanced(
    [
      { id: 'A', duration: 8 },
      { id: 'B', duration: 6 },
      { id: 'C', duration: 4 },
    ],
    2,
  );
  // LPT: 8→核0, 6→核1, 4→核1 => 核0=8, 核1=10
  assert.equal(r.makespan, 10);
});

test('sched-multicore-balanced 单核串行', () => {
  const r = scheduleMulticoreBalanced(
    [
      { id: 'A', duration: 2 },
      { id: 'B', duration: 3 },
    ],
    1,
  );
  assert.equal(r.makespan, 5);
});

test('sched-multicore-balanced trace', () => {
  assert.ok(buildTrace().length > 2);
});
