import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contractionHierarchiesQuery } from '../../src/algorithms/graph/graph-contraction-hierarchies/impl.ts';

const G = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 1 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'T', weight: 1 },
    { from: 'S', to: 'T', weight: 10 },
  ],
  order: ['A', 'B', 'S', 'T'],
};

test('ch 最短路 S->T', () => {
  const r = contractionHierarchiesQuery(G, 'S', 'T');
  // S-A-B-T = 3 优于直连 10
  assert.equal(r.found, true);
  assert.equal(r.dist, 3);
});

test('ch 相邻', () => {
  const r = contractionHierarchiesQuery(G, 'S', 'A');
  assert.equal(r.dist, 1);
});

test('ch 起终点相同', () => {
  const r = contractionHierarchiesQuery(G, 'S', 'S');
  assert.equal(r.dist, 0);
});
