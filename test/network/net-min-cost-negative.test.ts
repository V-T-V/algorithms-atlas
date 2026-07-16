import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minCostNegativeEdges,
  type NegCostEdge,
} from '../../src/algorithms/network/net-min-cost-negative/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-min-cost-negative/trace.ts';

test('net-min-cost-negative 含负边仍正确', () => {
  const edges: NegCostEdge[] = [
    { from: 0, to: 1, cap: 4, cost: -1 },
    { from: 0, to: 2, cap: 4, cost: 3 },
    { from: 1, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 3, cap: 3, cost: 2 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ];
  const r = minCostNegativeEdges(4, edges, 0, 3);
  assert.equal(r.maxFlow, 8);
  // 与全正边（把 -1 改为 1）对比，负边版本费用应更低
  const posEdges = edges.map((e) => ({ ...e, cost: Math.abs(e.cost) }));
  const rPos = minCostNegativeEdges(4, posEdges, 0, 3);
  assert.ok(r.minCost < rPos.minCost, `负边应更省：${r.minCost} >= ${rPos.minCost}`);
});

test('net-min-cost-negative 直连负费用', () => {
  const edges: NegCostEdge[] = [{ from: 0, to: 1, cap: 3, cost: -2 }];
  const r = minCostNegativeEdges(2, edges, 0, 1);
  assert.equal(r.maxFlow, 3);
  assert.equal(r.minCost, -6);
});

test('net-min-cost-negative 无负边退化', () => {
  const edges: NegCostEdge[] = [
    { from: 0, to: 1, cap: 2, cost: 1 },
    { from: 1, to: 2, cap: 2, cost: 1 },
  ];
  const r = minCostNegativeEdges(3, edges, 0, 2);
  assert.equal(r.maxFlow, 2);
  assert.equal(r.minCost, 4);
});

test('net-min-cost-negative 选负边路径', () => {
  // S->A 费 -1，A->T 费 1，总 0（便宜）；S->T 直连费 5（贵）
  const edges: NegCostEdge[] = [
    { from: 0, to: 1, cap: 5, cost: -1 },
    { from: 1, to: 2, cap: 5, cost: 1 },
    { from: 0, to: 2, cap: 5, cost: 5 },
  ];
  const r = minCostNegativeEdges(3, edges, 0, 2);
  // 两条路均可用，最大流 10；费用 = 5×0 (经 A) + 5×5 (直连) = 25
  assert.equal(r.maxFlow, 10);
  assert.equal(r.minCost, 25);
});

test('net-min-cost-negative trace', () => {
  assert.ok(buildTrace().length >= 2);
});
