import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primFibonacci, type GraphInput } from '../../src/algorithms/graph/prim-fibonacci/impl.ts';

test('prim-fibonacci 基本 MST', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4'],
    edges: [
      { from: '0', to: '1', weight: 4 },
      { from: '0', to: '2', weight: 1 },
      { from: '1', to: '2', weight: 3 },
      { from: '1', to: '3', weight: 2 },
      { from: '2', to: '3', weight: 5 },
      { from: '3', to: '4', weight: 6 },
      { from: '2', to: '4', weight: 7 },
    ],
    source: '0',
  };
  const { totalWeight, mstEdges } = primFibonacci(g);
  assert.equal(totalWeight, 12);
  assert.equal(mstEdges.length, 4);
});

test('prim-fibonacci 三角形 MST', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
    ],
    source: 'A',
  };
  const { totalWeight, mstEdges } = primFibonacci(g);
  assert.equal(totalWeight, 3);
  assert.equal(mstEdges.length, 2);
});

test('prim-fibonacci 单节点', () => {
  const { totalWeight, mstEdges } = primFibonacci({ nodes: ['X'], edges: [], source: 'X' });
  assert.equal(totalWeight, 0);
  assert.equal(mstEdges.length, 0);
});

test('prim-fibonacci 不连通图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'C', to: 'D', weight: 2 },
    ],
    source: 'A',
  };
  const { totalWeight, mstEdges } = primFibonacci(g);
  assert.equal(mstEdges.length, 1);
  assert.equal(totalWeight, 1);
});

test('prim-fibonacci 钩子被调用', () => {
  let extracts = 0;
  primFibonacci(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 2 },
        { from: 'A', to: 'C', weight: 3 },
      ],
      source: 'A',
    },
    { onExtract: () => extracts++ },
  );
  assert.equal(extracts, 3);
});
