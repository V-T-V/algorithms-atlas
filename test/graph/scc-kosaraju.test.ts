import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sccKosaraju, type GraphInput } from '../../src/algorithms/graph/scc-kosaraju/impl.ts';

const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
    { from: '4', to: '1' },
  ],
};

const norm = (comps: string[][]): string[][] =>
  comps.map((c) => [...c].sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));

test('scc-kosaraju 正确分量数', () => {
  const { components } = sccKosaraju(G);
  assert.equal(components.length, 2);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['3', '4', '5'],
  ]);
});

test('scc-kosaraju 单节点自环', () => {
  const g: GraphInput = { nodes: ['A'], edges: [{ from: 'A', to: 'A' }] };
  assert.equal(sccKosaraju(g).components.length, 1);
});

test('scc-kosaraju DAG 每点自成', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(sccKosaraju(g).components.length, 3);
});

test('scc-kosaraju 空图', () => {
  assert.deepEqual(sccKosaraju({ nodes: [], edges: [] }), { components: [] });
});

test('scc-kosaraju 大环为单 SCC', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '0' },
    ],
  };
  const { components } = sccKosaraju(g);
  assert.equal(components.length, 1);
  assert.equal(components[0]!.length, 5);
});

test('scc-kosaraju 钩子被调用', () => {
  let visit1 = 0;
  let comps = 0;
  sccKosaraju(G, {
    onVisit1: () => visit1++,
    onComponent: () => comps++,
  });
  assert.equal(visit1, 6);
  assert.equal(comps, 2);
});
