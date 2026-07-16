import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vcc, type GraphInput } from '../../src/algorithms/graph/vcc/impl.ts';

const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

const norm = (comps: string[][]): string[][] =>
  comps.map((c) => [...c].sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));

test('vcc 正确点双数与割点', () => {
  const { components, cutVertices } = vcc(G);
  // 三个点双：{0,1,2}, {2,3}, {3,4,5}
  assert.equal(components.length, 3);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['2', '3'],
    ['3', '4', '5'],
  ]);
  assert.deepEqual(cutVertices, ['2', '3']);
});

test('vcc 三角环：单个点双，无割点', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { components, cutVertices } = vcc(g);
  assert.equal(components.length, 1);
  assert.deepEqual(cutVertices, []);
});

test('vcc 简单链', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components, cutVertices } = vcc(g);
  assert.equal(components.length, 2);
  assert.deepEqual(cutVertices, ['B']);
});

test('vcc 单点图', () => {
  const { components } = vcc({ nodes: ['X'], edges: [] });
  // 孤立点也构成一个点双
  assert.equal(components.length, 1);
});

test('vcc 钩子被调用', () => {
  const discovered: string[] = [];
  let componentCount = 0;
  vcc(G, {
    onDiscover: (v) => discovered.push(v),
    onComponent: () => componentCount++,
  });
  assert.equal(discovered.length, 6);
  assert.equal(componentCount, 3);
});
