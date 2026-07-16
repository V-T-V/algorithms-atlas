import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfsLayered, type GraphInput } from '../../src/algorithms/graph/bfs-layered/impl.ts';

const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' },
  ],
};

test('bfs-layered 层数与距离', () => {
  const { layers, dist } = bfsLayered(G, 'A');
  assert.equal(layers.length, 3);
  assert.deepEqual(layers[0], ['A']);
  assert.deepEqual([...layers[1]!].sort(), ['B', 'C']);
  assert.deepEqual([...layers[2]!].sort(), ['D', 'E', 'F', 'G']);
  assert.equal(dist.get('A'), 0);
  assert.equal(dist.get('D'), 2);
  assert.equal(dist.get('G'), 2);
});

test('bfs-layered 单点', () => {
  const { layers, dist } = bfsLayered({ nodes: ['X'], edges: [] }, 'X');
  assert.equal(layers.length, 1);
  assert.equal(dist.get('X'), 0);
});

test('bfs-layered 不可达点不在 dist', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }] };
  const { dist } = bfsLayered(g, 'A');
  assert.ok(dist.has('A'));
  assert.ok(dist.has('B'));
  assert.ok(!dist.has('C'));
});

test('bfs-layered 环图距离', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  const { dist } = bfsLayered(g, 'A');
  assert.equal(dist.get('A'), 0);
  assert.equal(dist.get('B'), 1);
  assert.equal(dist.get('C'), 2);
  assert.equal(dist.get('D'), 1);
});

test('bfs-layered 源不在图中', () => {
  const { layers, dist } = bfsLayered(G, 'Z');
  assert.equal(layers.length, 0);
  assert.equal(dist.size, 0);
});

test('bfs-layered 钩子', () => {
  let visits = 0;
  let layerCalls = 0;
  bfsLayered(G, 'A', { onVisit: () => visits++, onLayer: () => layerCalls++ });
  assert.equal(visits, 7);
  assert.equal(layerCalls, 3);
});
