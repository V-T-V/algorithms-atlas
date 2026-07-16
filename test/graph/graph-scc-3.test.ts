import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kosarajuSCC, type TarjanGraphInput } from '../../src/algorithms/graph/graph-scc-3/impl.ts';

test('kosaraju 经典例', () => {
  const g: TarjanGraphInput = {
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '1' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
    ],
  };
  const sccs = kosarajuSCC(g);
  assert.equal(sccs.length, 3);
});

test('kosaraju 全环', () => {
  const g: TarjanGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(kosarajuSCC(g).length, 1);
});
