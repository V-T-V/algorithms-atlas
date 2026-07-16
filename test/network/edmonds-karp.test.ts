import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edmondsKarp, type FlowEdgeInput } from '../../src/algorithms/network/edmonds-karp/impl.ts';

test('edmondsKarp 经典图最大流', () => {
  const edges: FlowEdgeInput[] = [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ];
  assert.equal(edmondsKarp(5, edges, 0, 4), 18);
});

test('edmondsKarp CLRS 经典示例 = 23', () => {
  // CLRS 第 26 章
  const edges: FlowEdgeInput[] = [
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
  assert.equal(edmondsKarp(6, edges, 0, 5), 23);
});

test('edmondsKarp 平行边', () => {
  const edges: FlowEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 1, cap: 5 },
  ];
  assert.equal(edmondsKarp(2, edges, 0, 1), 8);
});

test('edmondsKarp 不连通返回 0', () => {
  const edges: FlowEdgeInput[] = [{ from: 0, to: 1, cap: 5 }];
  assert.equal(edmondsKarp(3, edges, 0, 2), 0);
});

test('edmondsKarp 单边', () => {
  const edges: FlowEdgeInput[] = [{ from: 0, to: 1, cap: 7 }];
  assert.equal(edmondsKarp(2, edges, 0, 1), 7);
});

test('edmondsKarp 与 ford-fulkerson 一致（BFS 增广）', () => {
  // 复杂图，结果应稳定
  const edges: FlowEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 2, cap: 3 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 3 },
    { from: 2, to: 3, cap: 2 },
  ];
  assert.equal(edmondsKarp(4, edges, 0, 3), 5);
});

test('edmondsKarp 钩子被调用', () => {
  let augments = 0;
  let noPath = 0;
  let total = -1;
  edmondsKarp(
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
      onAugment: (_p, _f, t) => {
        augments++;
        total = t;
      },
      onNoPath: (t) => {
        noPath++;
        total = t;
      },
    },
  );
  assert.ok(augments > 0);
  assert.equal(noPath, 1);
  assert.equal(total, 18);
});
