import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isBipartite,
  type BipGraphInput,
} from '../../src/algorithms/graph/graph-bipartite-3/impl.ts';

test('bipartite 偶环', () => {
  const g: BipGraphInput = {
    nodes: ['1', '2', '3', '4'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '1' },
    ],
  };
  assert.equal(isBipartite(g).bipartite, true);
});

test('bipartite 奇环', () => {
  const g: BipGraphInput = {
    nodes: ['1', '2', '3'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '1' },
    ],
  };
  assert.equal(isBipartite(g).bipartite, false);
});
