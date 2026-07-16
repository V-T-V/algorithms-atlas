import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsackDensityGreedy } from '../../src/algorithms/greedy/greedy-knapsack-density/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-knapsack-density/trace.ts';
test('密度贪心不超过容量', () => {
  const r = knapsackDensityGreedy(50, [
    { w: 10, v: 60 },
    { w: 30, v: 120 },
  ]);
  assert.ok(r.weight <= 50);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
