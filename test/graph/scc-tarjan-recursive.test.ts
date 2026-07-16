import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sccTarjanRecursive,
  type GraphInput,
} from '../../src/algorithms/graph/scc-tarjan-recursive/impl.ts';

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

test('scc-tarjan-recursive 两个 SCC', () => {
  const { components } = sccTarjanRecursive(G);
  assert.equal(components.length, 2);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['3', '4', '5'],
  ]);
});

test('scc-tarjan-recursive 单节点自环', () => {
  const g: GraphInput = { nodes: ['A'], edges: [{ from: 'A', to: 'A' }] };
  const { components } = sccTarjanRecursive(g);
  assert.equal(components.length, 1);
  assert.deepEqual(components[0], ['A']);
});

test('scc-tarjan-recursive DAG 每点自成分量', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components } = sccTarjanRecursive(g);
  assert.equal(components.length, 3);
});

test('scc-tarjan-recursive 空图', () => {
  assert.deepEqual(sccTarjanRecursive({ nodes: [], edges: [] }), { components: [] });
});

test('scc-tarjan-recursive 大环为一个 SCC', () => {
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
  const { components } = sccTarjanRecursive(g);
  assert.equal(components.length, 1);
  assert.equal(components[0]!.length, 5);
});
