import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyEarliestEnd } from '../../src/algorithms/greedy/greedy-earliest-end/impl.ts';

test('greedy-earliest-end 经典用例', () => {
  const r = greedyEarliestEnd([
    [1, 3],
    [2, 5],
    [4, 6],
    [6, 7],
    [5, 9],
    [8, 10],
  ]);
  // 选 [1,3],[4,6],[6,7],[8,10]（端点相接视为不重叠）
  assert.equal(r.count, 4);
});

test('greedy-earliest-end 全重叠取一', () => {
  const r = greedyEarliestEnd([
    [1, 10],
    [2, 9],
    [3, 8],
  ]);
  assert.equal(r.count, 1);
});

test('greedy-earliest-end 全不重叠全选', () => {
  const r = greedyEarliestEnd([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
  assert.equal(r.count, 3);
});
