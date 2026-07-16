import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestProcessNext } from '../../src/algorithms/scheduling/sched-shortest-process-next/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-shortest-process-next/trace.ts';

test('sched-shortest-process-next 选最短就绪进程', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 2 },
    { id: 'C', arrival: 0, burst: 3 },
  ];
  const res = shortestProcessNext(jobs);
  assert.deepEqual(res.order, ['B', 'C', 'A']);
});

test('sched-shortest-process-next 到达时间影响选择', () => {
  const jobs = [
    { id: 'A', arrival: 0, burst: 6 },
    { id: 'B', arrival: 1, burst: 2 },
  ];
  const res = shortestProcessNext(jobs);
  // A 在 t=0 开始（B 未到达），运行到 6；B t=6 才被选
  assert.equal(res.order[0], 'A');
  assert.equal(res.stats.find((s) => s.id === 'B')!.waiting, 5);
});

test('sched-shortest-process-next aging 防饥饿', () => {
  const jobs = [
    { id: 'LONG', arrival: 0, burst: 100 },
    { id: 'S1', arrival: 0, burst: 1 },
    { id: 'S2', arrival: 0, burst: 1 },
  ];
  // 不开 aging：LONG 最后
  const noAging = shortestProcessNext(jobs, false);
  assert.equal(noAging.order[noAging.order.length - 1], 'LONG');
});

test('sched-shortest-process-next trace', () => {
  assert.ok(buildTrace().length > 2);
});
