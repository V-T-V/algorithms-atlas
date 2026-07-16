import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boruvka, type MstGraphInput } from '../../src/algorithms/graph/graph-mst-3/impl.ts';

const g: MstGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

test('boruvka 总权', () => {
  const r = boruvka(g);
  assert.equal(r.totalWeight, 6);
  assert.equal(r.edges.length, 3);
});
