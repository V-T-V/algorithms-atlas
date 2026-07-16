import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxProfitSchedule } from '../../src/algorithms/greedy/greedy-max-profit-schedule/impl.ts';

test('greedy-max-profit-schedule 基本用例', () => {
  assert.equal(
    greedyMaxProfitSchedule([
      { start: 1, end: 3, profit: 50 },
      { start: 2, end: 4, profit: 10 },
      { start: 3, end: 5, profit: 70 },
      { start: 3, end: 6, profit: 60 },
    ]),
    120,
  );
});

test('greedy-max-profit-schedule 全不冲突取全部', () => {
  assert.equal(
    greedyMaxProfitSchedule([
      { start: 1, end: 2, profit: 10 },
      { start: 2, end: 3, profit: 20 },
      { start: 3, end: 4, profit: 30 },
    ]),
    60,
  );
});

test('greedy-max-profit-schedule 空', () => {
  assert.equal(greedyMaxProfitSchedule([]), 0);
});
