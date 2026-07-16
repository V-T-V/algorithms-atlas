import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyBreakingBound } from '../../src/algorithms/greedy/greedy-breaking-bound/impl.ts';

test('greedy-breaking-bound 经典 0-1 背包上界 = 240', () => {
  const r = greedyBreakingBound(
    [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    50,
  );
  // 60 + 100 + 120*(20/30) = 240
  assert.equal(r, 240);
});

test('greedy-breaking-bound 上界 >= 整数最优', () => {
  // 整数最优 = 220（取 60+100+120 需 60>50，故取 60+100=160 或 100+120=220）
  const r = greedyBreakingBound(
    [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    50,
  );
  assert.ok(r >= 220);
});

test('greedy-breaking-bound 容量 0 为 0', () => {
  assert.equal(greedyBreakingBound([{ weight: 5, value: 10 }], 0), 0);
});
