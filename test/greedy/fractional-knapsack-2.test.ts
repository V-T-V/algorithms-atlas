import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fractionalKnapsack2 } from '../../src/algorithms/greedy/fractional-knapsack-2/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/greedy/fractional-knapsack-2/trace.ts';

test('fractionalKnapsack2 经典示例 = 240', () => {
  const { value } = fractionalKnapsack2(
    [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    50,
  );
  assert.equal(value, 240);
});

test('fractionalKnapsack2 容量足够装全部', () => {
  const { value } = fractionalKnapsack2(
    [
      { weight: 2, value: 5 },
      { weight: 3, value: 6 },
    ],
    100,
  );
  assert.equal(value, 11);
});

test('fractionalKnapsack2 切分最后一件', () => {
  const { value } = fractionalKnapsack2([{ weight: 4, value: 40 }], 1);
  assert.equal(value, 10);
});

test('fractionalKnapsack2 钩子触发', () => {
  let takes = 0;
  fractionalKnapsack2(
    [
      { weight: 2, value: 4 },
      { weight: 4, value: 8 },
    ],
    3,
    { onTake: () => takes++ },
  );
  assert.equal(takes, 2);
});

test('buildTrace 含价值', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
