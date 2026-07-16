import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dijkstra,
  reconstructPath,
  type GraphInput,
} from '../../src/algorithms/graph/dijkstra/impl.ts';

const G: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'A', weight: 1 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

const distOf = (r: ReturnType<typeof dijkstra>, id: string): number => r.dist.get(id) ?? Infinity;

test('dijkstra 正确最短距离', () => {
  const r = dijkstra(G, 'S');
  assert.equal(distOf(r, 'S'), 0);
  assert.equal(distOf(r, 'B'), 2);
  assert.equal(distOf(r, 'A'), 3); // S→B→A = 3 < S→A=4
  assert.equal(distOf(r, 'C'), 8); // S→B→A→C = 8
  assert.equal(distOf(r, 'D'), 10); // ...→C→D = 10
  assert.equal(distOf(r, 'T'), 13); // ...→D→T = 13
});

test('dijkstra 路径回溯', () => {
  const r = dijkstra(G, 'S');
  assert.deepEqual(reconstructPath(r.prev, 'S', 'T'), ['S', 'B', 'A', 'C', 'D', 'T']);
  assert.deepEqual(reconstructPath(r.prev, 'S', 'A'), ['S', 'B', 'A']);
  assert.deepEqual(reconstructPath(r.prev, 'S', 'S'), ['S']);
});

test('dijkstra 单节点', () => {
  const r = dijkstra({ nodes: ['X'], edges: [] }, 'X');
  assert.equal(distOf(r, 'X'), 0);
});

test('dijkstra 不可达节点为 ∞', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 1 }] };
  const r = dijkstra(g, 'A');
  assert.equal(distOf(r, 'B'), 1);
  assert.equal(distOf(r, 'C'), Infinity);
  assert.equal(reconstructPath(r.prev, 'A', 'C'), null);
});

test('dijkstra 无向图对称', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'B', to: 'C', weight: 3 },
    ],
    directed: false,
  };
  const r = dijkstra(g, 'A');
  assert.equal(distOf(r, 'C'), 5);
  const r2 = dijkstra(g, 'C');
  assert.equal(distOf(r2, 'A'), 5);
});

test('dijkstra 不存在源点', () => {
  const r = dijkstra(G, 'Z');
  for (const n of G.nodes) assert.equal(distOf(r, n), Infinity);
});

test('dijkstra 钩子被调用', () => {
  const settled: string[] = [];
  let relaxImproved = 0;
  dijkstra(G, 'S', {
    onSettle: (n) => settled.push(n),
    onRelax: (_f, _t, _nd, imp) => {
      if (imp) relaxImproved++;
    },
  });
  assert.equal(settled.length, 6); // 全部可达均敲定
  assert.equal(settled[0], 'S');
  assert.ok(relaxImproved >= 5, '应发生多次松弛更新');
});
