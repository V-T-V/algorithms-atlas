import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sccGabow, type GraphInput } from '../../src/algorithms/graph/scc-gabow/impl.ts';

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

test('scc-gabow 两个 SCC', () => {
  const { components } = sccGabow(G);
  assert.equal(components.length, 2);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['3', '4', '5'],
  ]);
});

test('scc-gabow 单点自环', () => {
  const g: GraphInput = { nodes: ['A'], edges: [{ from: 'A', to: 'A' }] };
  assert.equal(sccGabow(g).components.length, 1);
});

test('scc-gabow DAG', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(sccGabow(g).components.length, 3);
});

test('scc-gabow 空图', () => {
  assert.deepEqual(sccGabow({ nodes: [], edges: [] }), { components: [] });
});

test('scc-gabow 钩子', () => {
  let disc = 0;
  let comp = 0;
  sccGabow(G, { onDiscover: () => disc++, onComponent: () => comp++ });
  assert.equal(disc, 6);
  assert.equal(comp, 2);
});
