import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edgeColoringGreedy } from '../../src/algorithms/graph/graph-edge-coloring/impl.ts';

const isValidEdgeColoring = (
  colors: number[],
  edges: ReadonlyArray<{ from: string; to: string }>,
): boolean => {
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      const a = edges[i]!;
      const b = edges[j]!;
      if (a.from === b.from || a.from === b.to || a.to === b.from || a.to === b.to) {
        if (colors[i] === colors[j]) return false;
      }
    }
  }
  return true;
};

test('edge-coloring K4 需 3 色', () => {
  const G = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
    ],
  };
  const c = edgeColoringGreedy(G);
  assert.ok(isValidEdgeColoring(c, G.edges));
});

test('edge-coloring 路径', () => {
  const G = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const c = edgeColoringGreedy(G);
  assert.ok(isValidEdgeColoring(c, G.edges));
  // 路径 2 条边相邻，需 2 色，但首条可能 0 第二条 1
  assert.equal(Math.max(...c), 1);
});

test('edge-coloring 单边', () => {
  const c = edgeColoringGreedy({ nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }] });
  assert.equal(c[0], 0);
});

test('edge-coloring 三角形 3 色', () => {
  const G = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  };
  const c = edgeColoringGreedy(G);
  assert.ok(isValidEdgeColoring(c, G.edges));
  assert.equal(Math.max(...c), 2);
});
