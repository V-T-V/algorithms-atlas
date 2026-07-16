import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  biconnectedComponent,
  type GraphInput,
} from '../../src/algorithms/graph/biconnected-component/impl.ts';

// 两个三角形共用 C：C 为割点
const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'C' },
  ],
};

const norm = (comps: string[][]): string[][] =>
  comps.map((c) => [...new Set(c)].sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));

test('bcc 两块共享割点 C', () => {
  const { components, cutVertices } = biconnectedComponent(G);
  assert.equal(components.length, 2);
  assert.deepEqual(cutVertices.sort(), ['C']);
  assert.deepEqual(norm(components), [
    ['A', 'B', 'C'],
    ['C', 'D', 'E'],
  ]);
});

test('bcc 单环无双连通（整图一块，无割点）', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  const { components, cutVertices } = biconnectedComponent(g);
  assert.equal(components.length, 1);
  assert.equal(cutVertices.length, 0);
});

test('bcc 桥边各自成块', () => {
  // A-B-C 链，B 为割点
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components, cutVertices } = biconnectedComponent(g);
  assert.equal(components.length, 2);
  assert.deepEqual(cutVertices, ['B']);
});

test('bcc 单点', () => {
  const g: GraphInput = { nodes: ['X'], edges: [] };
  const { components } = biconnectedComponent(g);
  assert.equal(components.length, 0);
});

test('bcc 钩子', () => {
  let cuts = 0;
  let comps = 0;
  biconnectedComponent(G, { onCutVertex: () => cuts++, onComponent: () => comps++ });
  assert.equal(cuts, 1);
  assert.equal(comps, 2);
});
