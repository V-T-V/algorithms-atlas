import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobSequencingDeadline } from '../../src/algorithms/scheduling/job-sequencing-deadline/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/job-sequencing-deadline/trace.ts';

test('jobSequencingDeadline 经典用例', () => {
  const r = jobSequencingDeadline([
    { id: 'A', deadline: 2, profit: 100 },
    { id: 'B', deadline: 1, profit: 50 },
    { id: 'C', deadline: 2, profit: 20 },
    { id: 'D', deadline: 1, profit: 30 },
    { id: 'E', deadline: 3, profit: 40 },
  ]);
  // 选 A(100, d2), B(50, d1), E(40, d3) = 190
  assert.equal(r.totalProfit, 190);
  assert.deepEqual([...r.selected].sort(), ['A', 'B', 'E']);
});

test('jobSequencingDeadline 槽冲突取最晚', () => {
  const r = jobSequencingDeadline([
    { id: 'A', deadline: 1, profit: 100 },
    { id: 'B', deadline: 1, profit: 50 },
  ]);
  assert.equal(r.totalProfit, 100);
  assert.deepEqual(r.selected, ['A']);
  assert.deepEqual(r.skipped, ['B']);
});

test('jobSequencingDeadline 利润降序优先', () => {
  const r = jobSequencingDeadline([
    { id: 'A', deadline: 3, profit: 10 },
    { id: 'B', deadline: 3, profit: 90 },
    { id: 'C', deadline: 3, profit: 50 },
  ]);
  assert.equal(r.totalProfit, 150); // 全选
  assert.deepEqual([...r.selected].sort(), ['A', 'B', 'C']);
});

test('jobSequencingDeadline 单作业', () => {
  const r = jobSequencingDeadline([{ id: 'X', deadline: 1, profit: 7 }]);
  assert.equal(r.totalProfit, 7);
  assert.deepEqual(r.selected, ['X']);
});

test('jobSequencingDeadline 非法截止期', () => {
  assert.throws(() => jobSequencingDeadline([{ id: 'A', deadline: 0, profit: 1 }]));
});

test('jobSequencingDeadline 空输入', () => {
  const r = jobSequencingDeadline([]);
  assert.equal(r.totalProfit, 0);
});

test('jobSequencingDeadline 钩子触发', () => {
  let considers = 0;
  jobSequencingDeadline(
    [
      { id: 'A', deadline: 1, profit: 10 },
      { id: 'B', deadline: 1, profit: 5 },
    ],
    { onConsider: () => considers++ },
  );
  assert.equal(considers, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
