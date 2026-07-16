import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleAffinity } from '../../src/algorithms/scheduling/sched-processor-affinity/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-processor-affinity/trace.ts';

test('sched-processor-affinity 总负载守恒', () => {
  const tasks = [
    { id: 'T1', load: 3, homeCore: 0 },
    { id: 'T2', load: 4, homeCore: 1 },
    { id: 'T3', load: 2, homeCore: 0 },
  ];
  const r = scheduleAffinity(tasks, 2);
  const total = r.coreLoads.reduce((a, b) => a + b, 0);
  assert.equal(total, 9);
});

test('sched-processor-affinity 失衡触发迁移', () => {
  const tasks = [
    { id: 'T1', load: 5, homeCore: 0 },
    { id: 'T2', load: 5, homeCore: 0 },
    { id: 'T3', load: 1, homeCore: 0 },
  ];
  const r = scheduleAffinity(tasks, 2, 2);
  assert.ok(r.migrations >= 1);
});

test('sched-processor-affinity 无失衡不迁移', () => {
  const tasks = [
    { id: 'T1', load: 1, homeCore: 0 },
    { id: 'T2', load: 1, homeCore: 1 },
  ];
  const r = scheduleAffinity(tasks, 2, 5);
  assert.equal(r.migrations, 0);
});

test('sched-processor-affinity trace', () => {
  assert.ok(buildTrace().length > 2);
});
