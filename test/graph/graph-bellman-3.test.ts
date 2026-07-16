import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bellmanFord,
  type WeightedGraphInput,
} from '../../src/algorithms/graph/graph-bellman-3/impl.ts';

const g: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'C', to: 'D', weight: 2 },
  ],
  directed: true,
};

test('bellman-ford 负权最短路', () => {
  const r = bellmanFord(g, 'A');
  assert.equal(r.dist.get('C'), 1);
  assert.equal(r.dist.get('D'), 3);
  assert.equal(r.hasNegativeCycle, false);
});

test('bellman-ford 负环检测', () => {
  const g2: WeightedGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -3 },
      { from: 'C', to: 'B', weight: 1 },
    ],
    directed: true,
  };
  const r = bellmanFord(g2, 'A');
  assert.equal(r.hasNegativeCycle, true);
});
