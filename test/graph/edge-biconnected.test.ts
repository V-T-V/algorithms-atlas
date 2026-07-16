import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  edgeBiconnectedComponent,
  type GraphInput,
} from '../../src/algorithms/graph/edge-biconnected/impl.ts';

const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'A' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'F', to: 'D' },
  ],
};

const norm = (comps: string[][]): string[][] =>
  comps.map((c) => [...c].sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));

test('ebc 两分量一桥', () => {
  const { components, bridges } = edgeBiconnectedComponent(G);
  assert.equal(components.length, 2);
  assert.equal(bridges.length, 1);
  assert.deepEqual(norm(components), [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
  ]);
});

test('ebc 单环无桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  const { components, bridges } = edgeBiconnectedComponent(g);
  assert.equal(components.length, 1);
  assert.equal(bridges.length, 0);
});

test('ebc 链全部是桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components, bridges } = edgeBiconnectedComponent(g);
  assert.equal(components.length, 3);
  assert.equal(bridges.length, 2);
});

test('ebc 空图', () => {
  assert.deepEqual(edgeBiconnectedComponent({ nodes: [], edges: [] }), {
    components: [],
    bridges: [],
  });
});

test('ebc 钩子', () => {
  let b = 0;
  let c = 0;
  edgeBiconnectedComponent(G, { onBridge: () => b++, onComponent: () => c++ });
  assert.equal(b, 1);
  assert.equal(c, 2);
});
