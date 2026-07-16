import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eulerCircuitExists,
  type GraphInput,
} from '../../src/algorithms/math/euler-circuit-math/impl.ts';

test('euler-exist 矩形+对角线（全偶度）', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'B', to: 'D' },
    ],
  };
  assert.equal(eulerCircuitExists(g).exists, true);
});

test('euler-exist 奇度数', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(eulerCircuitExists(g).exists, false);
});

test('euler-exist 三角形', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(eulerCircuitExists(g).exists, true);
});

test('euler-exist 不连通', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'B' },
      { from: 'C', to: 'D' },
      { from: 'C', to: 'D' },
    ],
  };
  // 两个分离的二元环：不连通
  assert.equal(eulerCircuitExists(g).exists, false);
});

test('euler-exist 无边图', () => {
  const g: GraphInput = { nodes: ['A', 'B'], edges: [] };
  assert.equal(eulerCircuitExists(g).exists, true);
});

test('euler-exist 有向平衡', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
    ],
    undirected: false,
  };
  assert.equal(eulerCircuitExists(g).exists, true);
});

test('euler-exist 钩子', () => {
  let res = 0;
  eulerCircuitExists(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    },
    { onResult: () => res++ },
  );
  assert.equal(res, 1);
});
