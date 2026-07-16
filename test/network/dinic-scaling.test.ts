import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dinicScaling, type DsEdgeInput } from '../../src/algorithms/network/dinic-scaling/impl.ts';

test('dinic-scaling 经典图最大流 = 18', () => {
  const edges: DsEdgeInput[] = [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ];
  assert.equal(dinicScaling(5, edges, 0, 4), 18);
});

test('dinic-scaling CLRS 经典示例 = 23', () => {
  const edges: DsEdgeInput[] = [
    { from: 0, to: 1, cap: 16 },
    { from: 0, to: 2, cap: 13 },
    { from: 1, to: 3, cap: 12 },
    { from: 2, to: 1, cap: 4 },
    { from: 2, to: 4, cap: 14 },
    { from: 3, to: 2, cap: 9 },
    { from: 3, to: 5, cap: 20 },
    { from: 4, to: 3, cap: 7 },
    { from: 4, to: 5, cap: 4 },
  ];
  assert.equal(dinicScaling(6, edges, 0, 5), 23);
});

test('dinic-scaling 平行边', () => {
  const edges: DsEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 1, cap: 5 },
  ];
  assert.equal(dinicScaling(2, edges, 0, 1), 8);
});

test('dinic-scaling 不连通返回 0', () => {
  const edges: DsEdgeInput[] = [{ from: 0, to: 1, cap: 5 }];
  assert.equal(dinicScaling(3, edges, 0, 2), 0);
});

test('dinic-scaling 钩子被调用', () => {
  let scales = 0;
  let done = -1;
  dinicScaling(
    5,
    [
      { from: 0, to: 1, cap: 10 },
      { from: 0, to: 2, cap: 10 },
      { from: 1, to: 2, cap: 2 },
      { from: 1, to: 3, cap: 4 },
      { from: 1, to: 4, cap: 8 },
      { from: 2, to: 3, cap: 9 },
      { from: 3, to: 4, cap: 10 },
    ],
    0,
    4,
    {
      onScale: () => scales++,
      onDone: (t) => (done = t),
    },
  );
  assert.ok(scales > 0);
  assert.equal(done, 18);
});

test('dinic-scaling 源等于汇返回 0', () => {
  assert.equal(dinicScaling(3, [{ from: 0, to: 1, cap: 5 }], 1, 1), 0);
});

test('dinic-scaling 大容量跨度', () => {
  // 容量跨度大：1 到 1000
  const edges: DsEdgeInput[] = [
    { from: 0, to: 1, cap: 1000 },
    { from: 1, to: 2, cap: 1 },
    { from: 2, to: 3, cap: 1000 },
  ];
  assert.equal(dinicScaling(4, edges, 0, 3), 1);
});
