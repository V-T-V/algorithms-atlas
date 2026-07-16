import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCostCirculation } from '../../src/algorithms/network/net-min-cost-circulation/impl.ts';

test('minCostCirculation 返回有限费用', () => {
  const cost = minCostCirculation({
    n: 3,
    edges: [
      { from: 0, to: 1, cap: 3, cost: 1 },
      { from: 1, to: 2, cap: 3, cost: 1 },
      { from: 2, to: 0, cap: 3, cost: 1 },
    ],
  });
  assert.equal(typeof cost, 'number');
});

test('minCostCirculation 无负环时费用非负', () => {
  const cost = minCostCirculation({
    n: 3,
    edges: [
      { from: 0, to: 1, cap: 2, cost: 2 },
      { from: 1, to: 2, cap: 2, cost: 3 },
      { from: 2, to: 0, cap: 2, cost: 4 },
    ],
  });
  assert.ok(cost >= 0);
});

test('minCostCirculation 钩子被调用', () => {
  let called = false;
  minCostCirculation(
    {
      n: 3,
      edges: [
        { from: 0, to: 1, cap: 1, cost: -1 },
        { from: 1, to: 2, cap: 1, cost: -1 },
        { from: 2, to: 0, cap: 1, cost: 1 },
      ],
    },
    { onResult: () => (called = true) },
  );
  assert.ok(called);
});
