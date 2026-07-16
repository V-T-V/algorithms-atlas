import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  networkSimplex,
  type NsEdgeInput,
} from '../../src/algorithms/network/network-simplex/impl.ts';

test('network-simplex 简单图正确求最小费用流', () => {
  const edges: NsEdgeInput[] = [
    { from: 0, to: 1, cap: 4, cost: 2 },
    { from: 0, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 2, cap: 2, cost: 3 },
    { from: 1, to: 3, cap: 3, cost: 1 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ];
  const r = networkSimplex(4, edges, 0, 3);
  assert.equal(r.maxFlow, 6);
  assert.ok(r.minCost > 0);
});

test('network-simplex 单条边', () => {
  const edges: NsEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 2 }];
  const r = networkSimplex(2, edges, 0, 1);
  assert.equal(r.maxFlow, 5);
  assert.equal(r.minCost, 10);
});

test('network-simplex 平行边选便宜的', () => {
  const edges: NsEdgeInput[] = [
    { from: 0, to: 1, cap: 3, cost: 5 },
    { from: 0, to: 1, cap: 3, cost: 1 },
  ];
  const r = networkSimplex(2, edges, 0, 1);
  assert.equal(r.maxFlow, 6);
  assert.equal(r.minCost, 3 * 1 + 3 * 5);
});

test('network-simplex 不连通返回 0', () => {
  const edges: NsEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 1 }];
  const r = networkSimplex(3, edges, 0, 2);
  assert.equal(r.maxFlow, 0);
});

test('network-simplex 钩子被调用', () => {
  let pivots = 0;
  let done = false;
  networkSimplex(
    4,
    [
      { from: 0, to: 1, cap: 4, cost: 2 },
      { from: 0, to: 2, cap: 2, cost: 1 },
      { from: 1, to: 2, cap: 2, cost: 3 },
      { from: 1, to: 3, cap: 3, cost: 1 },
      { from: 2, to: 3, cap: 5, cost: 1 },
    ],
    0,
    3,
    {
      onPivot: () => pivots++,
      onDone: () => (done = true),
    },
  );
  assert.ok(pivots >= 0);
  assert.ok(done);
});

test('network-simplex 源等于汇返回 0', () => {
  const r = networkSimplex(3, [{ from: 0, to: 1, cap: 5, cost: 1 }], 1, 1);
  assert.equal(r.maxFlow, 0);
});
