import { test } from 'node:test';
import assert from 'node:assert/strict';
import { virtualTree, type GraphInput } from '../../src/algorithms/graph/virtual-tree/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' },
    { from: '6', to: '7' },
  ],
  root: '1',
};

test('virtual-tree 节点含全部关键点与 LCA', () => {
  const { vertices } = virtualTree(G, ['3', '5', '7']);
  const set = new Set(vertices);
  // 关键点必在
  for (const k of ['3', '5', '7']) assert.ok(set.has(k));
  // LCA(3,5)=1, LCA(5,7)=4，均应在
  assert.ok(set.has('1'));
  assert.ok(set.has('4'));
});

test('virtual-tree 规模 O(k)', () => {
  const { vertices } = virtualTree(G, ['3', '5', '7']);
  assert.ok(vertices.length <= 2 * 3 + 1);
});

test('virtual-tree 边数 = 节点数 - 1', () => {
  const { vertices, edges } = virtualTree(G, ['3', '5', '7']);
  assert.equal(edges.length, vertices.length - 1);
});

test('virtual-tree 单关键点只含自身与根', () => {
  const { vertices } = virtualTree(G, ['7']);
  const set = new Set(vertices);
  assert.ok(set.has('7'));
  assert.ok(set.has('1')); // 根总在
});

test('virtual-tree 根为虚树根', () => {
  const { parent } = virtualTree(G, ['3', '5', '7']);
  assert.equal(parent.get('1'), null);
});

test('virtual-tree 钩子被调用', () => {
  const verts: string[] = [];
  let edges = 0;
  virtualTree(G, ['3', '5', '7'], {
    onAddVertex: (v) => verts.push(v),
    onTreeEdge: () => edges++,
  });
  assert.ok(verts.length >= 3);
  assert.ok(edges >= 1);
});
