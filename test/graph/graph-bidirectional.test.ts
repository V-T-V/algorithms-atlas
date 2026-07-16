import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bidirectionalBfs } from '../../src/algorithms/graph/graph-bidirectional/impl.ts';

const G = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A' },
    { from: 'S', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'T' },
  ],
};

test('bi-bfs 最短路径', () => {
  const r = bidirectionalBfs(G, 'S', 'T');
  assert.equal(r.found, true);
  assert.equal(r.dist, 4);
});

test('bi-bfs 相邻', () => {
  const r = bidirectionalBfs(G, 'S', 'A');
  assert.equal(r.dist, 1);
});

test('bi-bfs 起点等于终点', () => {
  const r = bidirectionalBfs(G, 'S', 'S');
  assert.equal(r.found, true);
  assert.equal(r.dist, 0);
});

test('bi-bfs 不连通', () => {
  const r = bidirectionalBfs({ nodes: ['A', 'B'], edges: [] }, 'A', 'B');
  assert.equal(r.found, false);
});

test('bi-bfs 有向', () => {
  const r = bidirectionalBfs(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ],
      directed: true,
    },
    'A',
    'C',
  );
  assert.equal(r.dist, 2);
});
