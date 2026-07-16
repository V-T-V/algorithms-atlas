import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maximumClique, type GraphInput } from '../../src/algorithms/graph/maximum-clique/impl.ts';

const isClique = (g: GraphInput, set: string[]): boolean => {
  const adj = new Map<string, Set<string>>();
  for (const n of g.nodes) adj.set(n, new Set());
  for (const e of g.edges) {
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }
  for (let i = 0; i < set.length; i++) {
    for (let j = i + 1; j < set.length; j++) {
      if (!adj.get(set[i]!)!.has(set[j]!)) return false;
    }
  }
  return true;
};

test('maximum-clique K4 + 边', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'A', to: 'E' },
      { from: 'B', to: 'E' },
    ],
  };
  const { clique, size } = maximumClique(g);
  assert.equal(size, 4);
  assert.ok(isClique(g, clique));
});

test('maximum-clique 三角形', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(maximumClique(g).size, 3);
});

test('maximum-clique 无边图为 1', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [] };
  assert.equal(maximumClique(g).size, 1);
});

test('maximum-clique 链为 2', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(maximumClique(g).size, 2);
});

test('maximum-clique 空图', () => {
  const { size, maximalCount } = maximumClique({ nodes: [], edges: [] });
  assert.equal(size, 0);
  assert.equal(maximalCount, 0);
});

test('maximum-clique 钩子', () => {
  let cliques = 0;
  maximumClique(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    },
    { onClique: () => cliques++ },
  );
  assert.ok(cliques >= 1);
});
