import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gusfieldTree,
  treeMinCut,
  type Gh2Edge,
} from '../../src/algorithms/network/net-gomory-hu-2/impl.ts';
import { fordFulkerson } from '../../src/algorithms/network/ford-fulkerson/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-gomory-hu-2/trace.ts';

function directMinCut(n: number, edges: Gh2Edge[], s: number, t: number): number {
  // 无向图：每条边拆为两条有向边
  const ffEdges: Array<{ from: string; to: string; capacity: number }> = [];
  for (const e of edges) {
    ffEdges.push({ from: String(e.from), to: String(e.to), capacity: e.cap });
    ffEdges.push({ from: String(e.to), to: String(e.from), capacity: e.cap });
  }
  const nodes = Array.from({ length: n }, (_, i) => String(i));
  return fordFulkerson({ nodes, edges: ffEdges, source: String(s), sink: String(t) }).maxFlow;
}

test('net-gomory-hu-2 树边数 = n-1', () => {
  const edges: Gh2Edge[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 4 },
    { from: 2, to: 3, cap: 3 },
    { from: 0, to: 3, cap: 5 },
    { from: 1, to: 3, cap: 2 },
  ];
  const { tree, edges: te } = gusfieldTree(4, edges);
  assert.equal(te.length, 3);
  assert.equal(tree.size, 4);
});

test('net-gomory-hu-2 mincut 一致性', () => {
  const edges: Gh2Edge[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 4 },
    { from: 2, to: 3, cap: 3 },
    { from: 0, to: 3, cap: 5 },
    { from: 1, to: 3, cap: 2 },
  ];
  const { tree } = gusfieldTree(4, edges);
  // 树上 mincut 应等于直接 maxflow
  for (const [s, t] of [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ] as const) {
    assert.equal(treeMinCut(tree, s, t), directMinCut(4, edges, s, t), `mincut(${s},${t}) 不一致`);
  }
});

test('net-gomory-hu-2 三角图', () => {
  const edges: Gh2Edge[] = [
    { from: 0, to: 1, cap: 2 },
    { from: 1, to: 2, cap: 3 },
    { from: 0, to: 2, cap: 4 },
  ];
  const { tree } = gusfieldTree(3, edges);
  // 无向最小割
  assert.equal(treeMinCut(tree, 0, 1), 5); // {0,2}|{1}: 0-1(2)+2-1(3)=5
  assert.equal(treeMinCut(tree, 1, 2), 5); // {1,0}|{2}: 0-2(4)+1-2(3)→ min={1}|{0,2}=2+3=5
  assert.equal(treeMinCut(tree, 0, 2), 6); // {0}|{1,2}: 0-1(2)+0-2(4)=6
});

test('net-gomory-hu-2 单节点', () => {
  const { tree, edges } = gusfieldTree(1, []);
  assert.equal(edges.length, 0);
  assert.equal(tree.size, 1);
});

test('net-gomory-hu-2 trace', () => {
  assert.ok(buildTrace().length >= 2);
});
