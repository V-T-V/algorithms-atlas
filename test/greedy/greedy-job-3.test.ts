import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyJob3 } from '../../src/algorithms/greedy/greedy-job-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-job-3/trace.ts';

test('作业调度经典示例', () => {
  const jobs = [
    { id: 'a', profit: 100, deadline: 2 },
    { id: 'b', profit: 19, deadline: 1 },
    { id: 'c', profit: 27, deadline: 2 },
    { id: 'd', profit: 25, deadline: 1 },
  ];
  const r = greedyJob3(jobs);
  assert.equal(r.totalProfit, 100 + 27);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
