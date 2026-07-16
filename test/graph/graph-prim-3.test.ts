import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prim, type PrimGraphInput } from '../../src/algorithms/graph/graph-prim-3/impl.ts';

const g: PrimGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

test('prim 总权', () => {
  const r = prim(g, 'A');
  assert.equal(r.totalWeight, 6);
});

test('prim 边数 = V-1', () => {
  const r = prim(g, 'A');
  assert.equal(r.treeEdges.length, 3);
});
