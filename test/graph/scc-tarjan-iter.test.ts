import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sccTarjanIter, type GraphInput } from '../../src/algorithms/graph/scc-tarjan-iter/impl.ts';

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

test('scc-tarjan-iter 正确分量数', () => {
  const { components } = sccTarjanIter(G);
  assert.equal(components.length, 2);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['3', '4', '5'],
  ]);
});

test('scc-tarjan-iter 单节点自环', () => {
  const g: GraphInput = { nodes: ['A'], edges: [{ from: 'A', to: 'A' }] };
  const { components } = sccTarjanIter(g);
  assert.equal(components.length, 1);
  assert.deepEqual(components[0], ['A']);
});

test('scc-tarjan-iter DAG 每点自成一分量', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components } = sccTarjanIter(g);
  assert.equal(components.length, 3);
});

test('scc-tarjan-iter 空图', () => {
  assert.deepEqual(sccTarjanIter({ nodes: [], edges: [] }), { components: [] });
});

test('scc-tarjan-iter 与递归版一致（大环）', () => {
  // 0→1→2→3→4→0 五元环 → 一个 SCC
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
  const { components } = sccTarjanIter(g);
  assert.equal(components.length, 1);
  assert.equal(components[0]!.length, 5);
});

test('scc-tarjan-iter 钩子被调用', () => {
  const discovered: string[] = [];
  let componentCount = 0;
  sccTarjanIter(G, {
    onDiscover: (v) => discovered.push(v),
    onComponent: () => componentCount++,
  });
  assert.equal(discovered.length, 6);
  assert.equal(componentCount, 2);
});
