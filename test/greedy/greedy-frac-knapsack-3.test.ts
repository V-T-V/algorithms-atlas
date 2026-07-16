import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyFracKnapsack3 } from '../../src/algorithms/greedy/greedy-frac-knapsack-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-frac-knapsack-3/trace.ts';

test('分数背包经典示例', () => {
  const r = greedyFracKnapsack3(50, [
    { w: 10, v: 60 },
    { w: 20, v: 100 },
    { w: 30, v: 120 },
  ]);
  assert.equal(r.totalValue, 240);
});

test('容量足以装全部', () => {
  const r = greedyFracKnapsack3(1000, [{ w: 10, v: 60 }]);
  assert.equal(r.totalValue, 60);
  assert.equal(r.fractions[0], 1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
