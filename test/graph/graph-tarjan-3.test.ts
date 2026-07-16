import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tarjanSCC,
  type TarjanGraphInput,
} from '../../src/algorithms/graph/graph-tarjan-3/impl.ts';

test('tarjan SCC 经典例', () => {
  const g: TarjanGraphInput = {
    nodes: ['1', '2', '3', '4', '5', '6', '7'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '1' },
      { from: '2', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '6' },
      { from: '6', to: '4' },
    ],
  };
  const sccs = tarjanSCC(g)
    .map((s) => [...s].sort())
    .sort((a, b) => a[0]!.localeCompare(b[0]!));
  assert.equal(sccs.length, 3);
});

test('tarjan 单点无环', () => {
  const g: TarjanGraphInput = {
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'B' }],
  };
  const sccs = tarjanSCC(g);
  assert.equal(sccs.length, 2);
});

test('tarjan 全环', () => {
  const g: TarjanGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(tarjanSCC(g).length, 1);
});
