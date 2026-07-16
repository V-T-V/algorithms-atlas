import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minCostByCycleCancel,
  type McEdge,
} from '../../src/algorithms/network/net-min-cost-cycle/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-min-cost-cycle/trace.ts';

test('net-min-cost-cycle 基本最小费用最大流', () => {
  const edges: McEdge[] = [
    { from: 'S', to: 'A', cap: 4, cost: 1 },
    { from: 'S', to: 'B', cap: 4, cost: 5 },
    { from: 'A', to: 'B', cap: 2, cost: 2 },
    { from: 'A', to: 'T', cap: 3, cost: 3 },
    { from: 'B', to: 'T', cap: 5, cost: 2 },
  ];
  const r = minCostByCycleCancel(edges, ['S', 'A', 'B', 'T'], 'S', 'T');
  assert.equal(r.maxFlow, 8);
  assert.ok(r.minCost >= 0);
});

test('net-min-cost-cycle 直连', () => {
  const edges: McEdge[] = [{ from: 'S', to: 'T', cap: 3, cost: 4 }];
  const r = minCostByCycleCancel(edges, ['S', 'T'], 'S', 'T');
  assert.equal(r.maxFlow, 3);
  assert.equal(r.minCost, 12);
});

test('net-min-cost-cycle 费用为正累加', () => {
  const edges: McEdge[] = [
    { from: 'S', to: 'A', cap: 2, cost: 1 },
    { from: 'A', to: 'T', cap: 2, cost: 1 },
  ];
  const r = minCostByCycleCancel(edges, ['S', 'A', 'T'], 'S', 'T');
  assert.equal(r.maxFlow, 2);
  assert.equal(r.minCost, 4); // 2 单位 × (1+1)
});

test('net-min-cost-cycle 多路径选优', () => {
  // 两条 S->T：直接贵，绕 A 便宜
  const edges: McEdge[] = [
    { from: 'S', to: 'A', cap: 5, cost: 1 },
    { from: 'A', to: 'T', cap: 5, cost: 1 },
    { from: 'S', to: 'T', cap: 5, cost: 10 },
  ];
  const r = minCostByCycleCancel(edges, ['S', 'A', 'T'], 'S', 'T');
  // 两条路均满：5 经 A (费 2×5=10) + 5 直连 (费 10×5=50) = 60
  assert.equal(r.maxFlow, 10);
  assert.equal(r.minCost, 60);
});

test('net-min-cost-cycle trace', () => {
  assert.ok(buildTrace().length >= 2);
});
