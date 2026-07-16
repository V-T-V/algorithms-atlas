import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  successiveShortestPath,
  type SspEdgeInput,
} from '../../src/algorithms/network/successive-shortest-path/impl.ts';

test('SSP 简单图正确求最小费用流', () => {
  const edges: SspEdgeInput[] = [
    { from: 0, to: 1, cap: 4, cost: 2 },
    { from: 0, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 2, cap: 2, cost: 3 },
    { from: 1, to: 3, cap: 3, cost: 1 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ];
  const r = successiveShortestPath(4, edges, 0, 3);
  assert.equal(r.maxFlow, 6);
  assert.ok(r.minCost > 0);
});

test('SSP 单条边', () => {
  const edges: SspEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 2 }];
  const r = successiveShortestPath(2, edges, 0, 1);
  assert.equal(r.maxFlow, 5);
  assert.equal(r.minCost, 10);
});

test('SSP 平行边选便宜的', () => {
  const edges: SspEdgeInput[] = [
    { from: 0, to: 1, cap: 3, cost: 5 },
    { from: 0, to: 1, cap: 3, cost: 1 },
  ];
  const r = successiveShortestPath(2, edges, 0, 1);
  assert.equal(r.maxFlow, 6);
  // 便宜边先满，再走贵边
  assert.equal(r.minCost, 3 * 1 + 3 * 5);
});

test('SSP 不连通返回 0', () => {
  const edges: SspEdgeInput[] = [{ from: 0, to: 1, cap: 5, cost: 1 }];
  const r = successiveShortestPath(3, edges, 0, 2);
  assert.equal(r.maxFlow, 0);
  assert.equal(r.minCost, 0);
});

test('SSP 钩子被调用', () => {
  let augments = 0;
  let done = false;
  successiveShortestPath(
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
      onAugment: () => augments++,
      onDone: () => (done = true),
    },
  );
  assert.ok(augments > 0);
  assert.ok(done);
});

test('SSP 源等于汇返回 0', () => {
  const r = successiveShortestPath(3, [{ from: 0, to: 1, cap: 5, cost: 1 }], 1, 1);
  assert.equal(r.maxFlow, 0);
});
