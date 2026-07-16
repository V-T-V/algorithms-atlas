import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dinic, type DinicEdgeInput } from '../../src/algorithms/network/dinic-maxflow/impl.ts';

test('dinic 经典图最大流 = 18', () => {
  const edges: DinicEdgeInput[] = [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ];
  assert.equal(dinic(5, edges, 0, 4), 18);
});

test('dinic CLRS 经典示例 = 23', () => {
  const edges: DinicEdgeInput[] = [
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
  assert.equal(dinic(6, edges, 0, 5), 23);
});

test('dinic 与 edmonds-karp 结果一致', () => {
  // 复杂图
  const edges: DinicEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 2, cap: 3 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 3 },
    { from: 2, to: 3, cap: 2 },
  ];
  assert.equal(dinic(4, edges, 0, 3), 5);
});

test('dinic 平行边', () => {
  const edges: DinicEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 1, cap: 5 },
  ];
  assert.equal(dinic(2, edges, 0, 1), 8);
});

test('dinic 不连通返回 0', () => {
  const edges: DinicEdgeInput[] = [{ from: 0, to: 1, cap: 5 }];
  assert.equal(dinic(3, edges, 0, 2), 0);
});

test('dinic 钩子被调用', () => {
  let phases = 0;
  let augs = 0;
  let done = -1;
  dinic(
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
      onAugment: () => augs++,
      onPhase: () => phases++,
      onDone: (t) => (done = t),
    },
  );
  assert.ok(phases > 0, '应有阶段事件');
  assert.ok(augs > 0, '应有增广事件');
  assert.equal(done, 18);
});

test('dinic 源等于汇返回 0', () => {
  assert.equal(dinic(3, [{ from: 0, to: 1, cap: 5 }], 1, 1), 0);
});
