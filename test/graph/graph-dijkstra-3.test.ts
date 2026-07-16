import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dijkstra,
  reconstructPath,
  type WeightedGraphInput,
} from '../../src/algorithms/graph/graph-dijkstra-3/impl.ts';

const g: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 1 },
  ],
  directed: true,
};

test('dijkstra 距离', () => {
  const r = dijkstra(g, 'A');
  assert.equal(r.dist.get('A'), 0);
  assert.equal(r.dist.get('B'), 1);
  assert.equal(r.dist.get('C'), 3);
  assert.equal(r.dist.get('D'), 4);
});

test('dijkstra 前驱路径', () => {
  const r = dijkstra(g, 'A');
  assert.deepEqual(reconstructPath(r.prev, 'D'), ['A', 'B', 'C', 'D']);
});

test('dijkstra 不可达', () => {
  const r = dijkstra({ nodes: ['A', 'Z'], edges: [] }, 'A');
  assert.equal(Number.isFinite(r.dist.get('Z') ?? Infinity), false);
});
