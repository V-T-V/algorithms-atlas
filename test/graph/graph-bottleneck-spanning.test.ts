import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bottleneckSpanningTree } from '../../src/algorithms/graph/graph-bottleneck-spanning/impl.ts';

const G = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 7 },
  ],
};

test('bottleneck MST 边', () => {
  // MST: A-C(1),B-C(2),C-D(3),C-E(6) => 最大边 6
  const r = bottleneckSpanningTree(G);
  assert.equal(r.connected, true);
  assert.equal(r.bottleneck, 6);
});

test('bottleneck 单边', () => {
  const r = bottleneckSpanningTree({
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'B', weight: 9 }],
  });
  assert.equal(r.bottleneck, 9);
});

test('bottleneck 三角形', () => {
  const r = bottleneckSpanningTree({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
    ],
  });
  // MST = A-B,B-C => max edge 2
  assert.equal(r.bottleneck, 2);
});

test('bottleneck 不连通', () => {
  const r = bottleneckSpanningTree({
    nodes: ['A', 'B', 'C'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
  });
  assert.equal(r.connected, false);
});
