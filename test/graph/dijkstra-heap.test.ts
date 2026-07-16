import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstraHeap, type GraphInput } from '../../src/algorithms/graph/dijkstra-heap/impl.ts';

const G: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 1 },
    { from: 'S', to: 'B', weight: 5 },
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'D', to: 'T', weight: 2 },
    { from: 'C', to: 'T', weight: 7 },
  ],
  source: 'S',
};

test('dijkstra-heap 基本最短路', () => {
  const { dist } = dijkstraHeap(G);
  assert.equal(dist.get('S'), 0);
  assert.equal(dist.get('A'), 1);
  assert.equal(dist.get('B'), 3);
  assert.equal(dist.get('C'), 4);
  assert.equal(dist.get('D'), 7);
  assert.equal(dist.get('T'), 9);
});

test('dijkstra-heap prev 正确回溯', () => {
  const { prev } = dijkstraHeap(G);
  assert.equal(prev.get('A'), 'S');
  assert.equal(prev.get('B'), 'A');
  assert.equal(prev.get('C'), 'B');
});

test('dijkstra-heap 不可达为 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
    source: 'A',
  };
  const { dist } = dijkstraHeap(g);
  assert.equal(dist.get('B'), 1);
  assert.equal(dist.get('C'), Infinity);
});

test('dijkstra-heap 单节点', () => {
  const { dist } = dijkstraHeap({ nodes: ['X'], edges: [], source: 'X' });
  assert.equal(dist.get('X'), 0);
});

test('dijkstra-heap 钩子被调用', () => {
  let settled = 0;
  dijkstraHeap(G, { onSettle: () => settled++ });
  assert.equal(settled, 6);
});
