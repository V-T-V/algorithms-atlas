import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobSeq } from '../../src/algorithms/greedy/job-seq/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/job-seq/trace.ts';

test('jobSeq 经典示例利润 60', () => {
  const { profit } = jobSeq([
    { id: 'A', deadline: 4, profit: 20 },
    { id: 'B', deadline: 1, profit: 10 },
    { id: 'C', deadline: 1, profit: 40 },
    { id: 'D', deadline: 1, profit: 30 },
  ]);
  // 只能选一个 deadline=1 的 + A
  assert.equal(profit, 60);
});

test('jobSeq 所有作业可安排', () => {
  const { profit } = jobSeq([
    { id: 'A', deadline: 3, profit: 10 },
    { id: 'B', deadline: 3, profit: 20 },
    { id: 'C', deadline: 3, profit: 30 },
  ]);
  assert.equal(profit, 60);
});

test('jobSeq 钩子触发', () => {
  let n = 0;
  jobSeq([{ id: 'A', deadline: 1, profit: 5 }], { onSchedule: () => n++ });
  assert.equal(n, 1);
});

test('buildTrace 含利润', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
