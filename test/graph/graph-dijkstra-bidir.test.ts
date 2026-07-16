import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bidirectionalDijkstra } from '../../src/algorithms/graph/graph-dijkstra-bidir/impl.ts';

const G = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

test('bidir-dijkstra S->T = 14', () => {
  const r = bidirectionalDijkstra(G, 'S', 'T');
  assert.equal(r.found, true);
  assert.equal(r.dist, 14);
});

test('bidir-dijkstra 相邻', () => {
  const r = bidirectionalDijkstra(G, 'S', 'A');
  assert.equal(r.dist, 4);
});

test('bidir-dijkstra 起终点相同', () => {
  const r = bidirectionalDijkstra(G, 'S', 'S');
  assert.equal(r.dist, 0);
});

test('bidir-dijkstra 不连通', () => {
  const r = bidirectionalDijkstra({ nodes: ['A', 'B'], edges: [] }, 'A', 'B');
  assert.equal(r.found, false);
});
