import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxClique } from '../../src/algorithms/graph/graph-max-clique-2/impl.ts';

const isClique = (clique: string[], edges: Set<string>): boolean => {
  for (let i = 0; i < clique.length; i++) {
    for (let j = i + 1; j < clique.length; j++) {
      const a = clique[i]!;
      const b = clique[j]!;
      if (!edges.has(`${a}-${b}`) && !edges.has(`${b}-${a}`)) return false;
    }
  }
  return true;
};

test('max-clique K4 子图', () => {
  const G = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
  };
  const c = maxClique(G);
  assert.equal(c.length, 4);
  const eset = new Set(G.edges.map((e) => `${e.from}-${e.to}`));
  assert.ok(isClique(c, eset));
});

test('max-clique 三角形', () => {
  const c = maxClique({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  });
  assert.equal(c.length, 3);
});

test('max-clique 无边', () => {
  const c = maxClique({ nodes: ['A', 'B'], edges: [] });
  assert.equal(c.length, 1);
});

test('max-clique 单节点', () => {
  const c = maxClique({ nodes: ['A'], edges: [] });
  assert.deepEqual(c, ['A']);
});
