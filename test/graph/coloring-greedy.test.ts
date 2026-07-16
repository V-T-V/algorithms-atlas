import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  coloringGreedy,
  type GraphInput,
} from '../../src/algorithms/graph/coloring-greedy/impl.ts';

const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'A' },
    { from: 'A', to: 'C' },
  ],
};

const isProper = (g: GraphInput, colors: Map<string, number>): boolean => {
  for (const e of g.edges) {
    if (colors.get(e.from) === colors.get(e.to)) return false;
  }
  return true;
};

test('coloring-greedy 合法着色', () => {
  const { colors, used } = coloringGreedy(G);
  assert.ok(isProper(G, colors));
  assert.ok(used >= 1 && used <= 4);
});

test('coloring-greedy 三角形用 3 色', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { used } = coloringGreedy(g);
  assert.equal(used, 3);
});

test('coloring-greedy 二分图用 ≤2 色', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'D' },
      { from: 'C', to: 'B' },
      { from: 'C', to: 'D' },
    ],
  };
  const { used, colors } = coloringGreedy(g);
  assert.ok(isProper(g, colors));
  assert.equal(used, 2);
});

test('coloring-greedy 空图', () => {
  const { colors, used } = coloringGreedy({ nodes: [], edges: [] });
  assert.equal(colors.size, 0);
  assert.equal(used, 0);
});

test('coloring-greedy 孤立点都同色', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [] };
  const { colors, used } = coloringGreedy(g);
  assert.equal(used, 1);
  assert.equal(colors.get('A'), 0);
  assert.equal(colors.get('B'), 0);
});

test('coloring-greedy 钩子', () => {
  let colored = 0;
  coloringGreedy(G, { onColor: () => colored++ });
  assert.equal(colored, 5);
});
