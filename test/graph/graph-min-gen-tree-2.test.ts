import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primMst } from '../../src/algorithms/graph/graph-min-gen-tree-2/impl.ts';

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

test('prim MST 总权', () => {
  // 选 A-C(1), C-B(2), C-D(3), C-E(6) = 12 ? 或 D-E(7)? min: C-E(6). 总=1+2+3+6=12
  const r = primMst(G, 'A');
  assert.equal(r.edges.length, 4);
  assert.equal(r.totalWeight, 12);
});

test('prim 起点不同结果相同', () => {
  const r1 = primMst(G, 'A');
  const r2 = primMst(G, 'C');
  assert.equal(r1.totalWeight, r2.totalWeight);
});

test('prim 单节点', () => {
  const r = primMst({ nodes: ['A'], edges: [] }, 'A');
  assert.equal(r.totalWeight, 0);
  assert.equal(r.edges.length, 0);
});

test('prim 三角形', () => {
  const r = primMst(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 2 },
        { from: 'A', to: 'C', weight: 3 },
      ],
    },
    'A',
  );
  assert.equal(r.totalWeight, 3); // 1+2
});
