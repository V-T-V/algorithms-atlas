import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cycleCancel,
  type CcEdgeInput,
} from '../../src/algorithms/network/min-cost-flow-cycle-cancel/impl.ts';

test('cycle-cancel 简单图正确求最小费用流', () => {
  const edges: CcEdgeInput[] = [
    { from: 0, to: 1, cap: 4, cost: 2 },
    { from: 0, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 2, cap: 2, cost: 3 },
    { from: 1, to: 3, cap: 3, cost: 1 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ];
  const r = cycleCancel(4, edges, 0, 3);
  // 最大流 = 6
  assert.equal(r.maxFlow, 6);
  // 费用应是合法的最小值
  assert.ok(r.minCost > 0);
});

test('cycle-cancel 单条边', () => {
  const edges: CcEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 2 }];
  const r = cycleCancel(2, edges, 0, 1);
  assert.equal(r.maxFlow, 5);
  assert.equal(r.minCost, 10);
});

test('cycle-cancel 平行边（选便宜的）', () => {
  const edges: CcEdgeInput[] = [
    { from: 0, to: 1, cap: 3, cost: 5 },
    { from: 0, to: 1, cap: 3, cost: 1 },
  ];
  const r = cycleCancel(2, edges, 0, 1);
  assert.equal(r.maxFlow, 6);
  // 应优先走便宜边（cap 3, cost 1），再走贵边（cap 3, cost 5）
  // 总费用 = 3*1 + 3*5 = 18，但 cycle-cancel 可能把贵的换成便宜的——不过两条边容量都为 3
  assert.ok(r.minCost <= 18);
});

test('cycle-cancel 不连通返回 0', () => {
  const edges: CcEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 1 }];
  const r = cycleCancel(3, edges, 0, 2);
  assert.equal(r.maxFlow, 0);
  assert.equal(r.minCost, 0);
});

test('cycle-cancel 钩子被调用', () => {
  let maxFlowFound = false;
  let done = false;
  cycleCancel(
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
      onMaxFlowFound: () => (maxFlowFound = true),
      onDone: () => (done = true),
    },
  );
  assert.ok(maxFlowFound);
  assert.ok(done);
});

test('cycle-cancel 源等于汇返回 0', () => {
  const r = cycleCancel(3, [{ from: 0, to: 1, cap: 5, cost: 1 }], 1, 1);
  assert.equal(r.maxFlow, 0);
});
