import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kruskal,
  type KruskalGraphInput,
} from '../../src/algorithms/graph/graph-kruskal-3/impl.ts';

const g: KruskalGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

test('kruskal 总权', () => {
  const r = kruskal(g);
  assert.equal(r.totalWeight, 6);
});

test('kruskal 边数 V-1', () => {
  const r = kruskal(g);
  assert.equal(r.treeEdges.length, 3);
});
