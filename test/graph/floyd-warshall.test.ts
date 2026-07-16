import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  floydWarshall,
  reconstructPath,
  type DistMatrix,
} from '../../src/algorithms/graph/floyd-warshall/impl.ts';

const INF = Infinity;

// 经典示例：A→D 直达 10，经 B,C 中转后变为 9
const G: DistMatrix = [
  [0, 5, INF, 10],
  [INF, 0, 3, INF],
  [INF, INF, 0, 1],
  [INF, INF, INF, 0],
];

const finite = (m: number[][]): (number | null)[][] =>
  m.map((row) => row.map((v) => (Number.isFinite(v) ? v : null)));

test('floyd-warshall 全源最短距离矩阵', () => {
  const { dist } = floydWarshall(G);
  assert.deepEqual(finite(dist), [
    [0, 5, 8, 9],
    [null, 0, 3, 4],
    [null, null, 0, 1],
    [null, null, null, 0],
  ]);
});

test('floyd-warshall A→D 经中转变短（10 → 9）', () => {
  const { dist } = floydWarshall(G);
  assert.equal(dist[0]![3]!, 9);
});

test('floyd-warshall 路径回溯 A→D', () => {
  const { next } = floydWarshall(G);
  assert.deepEqual(reconstructPath(next, 0, 3), [0, 1, 2, 3]); // A→B→C→D
  assert.deepEqual(reconstructPath(next, 0, 0), [0]);
});

test('floyd-warshall 单节点与空图', () => {
  assert.deepEqual(finite(floydWarshall([[0]]).dist), [[0]]);
  assert.deepEqual(finite(floydWarshall([]).dist), []);
});

test('floyd-warshall 不可达仍为 ∞', () => {
  const g: DistMatrix = [
    [0, 1, INF],
    [INF, 0, INF],
    [INF, INF, 0],
  ];
  const { dist } = floydWarshall(g);
  assert.equal(dist[0]![1]!, 1);
  assert.equal(dist[0]![2]!, INF);
  assert.equal(dist[2]![0]!, INF);
});

test('floyd-warshall 无向图距离对称', () => {
  const g: DistMatrix = [
    [0, 2, INF],
    [2, 0, 3],
    [INF, 3, 0],
  ];
  const { dist } = floydWarshall(g);
  assert.equal(dist[0]![2]!, 5);
  assert.equal(dist[2]![0]!, 5);
});

test('floyd-warshall 钩子被调用', () => {
  let iterates = 0;
  let relaxImproved = 0;
  floydWarshall(G, {
    onIterate: () => iterates++,
    onRelax: (_i, _j, _k, _o, _n, improved) => {
      if (improved) relaxImproved++;
    },
  });
  assert.equal(iterates, 4); // 4 个中转阶段
  assert.ok(relaxImproved >= 2, '应发生多次松弛更新');
});
