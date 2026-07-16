import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kosaraju2, type GraphInput } from '../../src/algorithms/graph/kosaraju-2/impl.ts';

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

test('kosaraju-2 正确分量', () => {
  const { components } = kosaraju2(G);
  assert.equal(components.length, 2);
  assert.deepEqual(norm(components), [
    ['0', '1', '2'],
    ['3', '4', '5'],
  ]);
});

test('kosaraju-2 DAG 每点自成', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(kosaraju2(g).components.length, 3);
});

test('kosaraju-2 自环单点', () => {
  const g: GraphInput = { nodes: ['A'], edges: [{ from: 'A', to: 'A' }] };
  const { components } = kosaraju2(g);
  assert.equal(components.length, 1);
  assert.deepEqual(components[0], ['A']);
});

test('kosaraju-2 空图', () => {
  assert.deepEqual(kosaraju2({ nodes: [], edges: [] }), { components: [] });
});

test('kosaraju-2 单大环为一个 SCC', () => {
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
  assert.equal(kosaraju2(g).components.length, 1);
});

test('kosaraju-2 钩子被调用', () => {
  const finished: string[] = [];
  let componentCount = 0;
  kosaraju2(G, {
    onFinish1: (v) => finished.push(v),
    onComponent: () => componentCount++,
  });
  assert.equal(finished.length, 6);
  assert.equal(componentCount, 2);
});
