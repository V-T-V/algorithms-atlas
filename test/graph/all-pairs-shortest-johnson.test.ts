import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  allPairsShortestPath,
  reconstructPath,
  type GraphInput,
} from '../../src/algorithms/graph/all-pairs-shortest-johnson/impl.ts';

const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'D', weight: 2 },
  ],
};

const idx = new Map(G.nodes.map((n, i) => [n, i] as const));

test('apsh 距离正确', () => {
  const { dist, hasNegativeCycle } = allPairsShortestPath(G);
  assert.equal(hasNegativeCycle, false);
  assert.equal(dist[idx.get('A')!]![idx.get('A')!]!, 0);
  assert.equal(dist[idx.get('A')!]![idx.get('D')!]!, 5); // A-B-C-D = 2+1+2
  assert.equal(dist[idx.get('A')!]![idx.get('C')!]!, 3); // A-B-C
  assert.equal(dist[idx.get('B')!]![idx.get('D')!]!, 3); // B-C-D
});

test('apsh 路径重建', () => {
  const { next } = allPairsShortestPath(G);
  const p = reconstructPath(next, G.nodes, idx.get('A')!, idx.get('D')!);
  assert.deepEqual(p, ['A', 'B', 'C', 'D']);
  const pSelf = reconstructPath(next, G.nodes, idx.get('A')!, idx.get('A')!);
  assert.deepEqual(pSelf, ['A']);
});

test('apsh 单点', () => {
  const r = allPairsShortestPath({ nodes: ['X'], edges: [] });
  assert.equal(r.dist[0]![0], 0);
});

test('apsh 负权边', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'B', to: 'C', weight: -3 },
    ],
  };
  const { dist } = allPairsShortestPath(g);
  assert.equal(dist[0]![2], 1); // A-B-C = 4-3
});

test('apsh 负环检测', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -3 },
      { from: 'C', to: 'A', weight: 1 },
    ],
  };
  const { hasNegativeCycle } = allPairsShortestPath(g);
  assert.equal(hasNegativeCycle, true);
});

test('apsh 空图', () => {
  const r = allPairsShortestPath({ nodes: [], edges: [] });
  assert.equal(r.dist.length, 0);
});

test('apsh 钩子', () => {
  let relax = 0;
  allPairsShortestPath(G, { onRelax: () => relax++ });
  assert.ok(relax > 0);
});
