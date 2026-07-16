import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rmqLca, type GraphInput } from '../../src/algorithms/graph/rmq-lca/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
  ],
  root: '1',
};

test('rmq-lca 正确 LCA', () => {
  const { query } = rmqLca(G);
  assert.equal(query('3', '5'), '1');
  assert.equal(query('3', '2'), '2');
  assert.equal(query('4', '5'), '4');
  assert.equal(query('3', '4'), '1');
});

test('rmq-lca 自身', () => {
  const { query } = rmqLca(G);
  assert.equal(query('3', '3'), '3');
});

test('rmq-lca 欧拉序列长度 = 2n-1', () => {
  const { euler } = rmqLca(G);
  assert.equal(euler.length, 2 * G.nodes.length - 1);
});

test('rmq-lca 与根', () => {
  const { query } = rmqLca(G);
  assert.equal(query('5', '1'), '1');
});

test('rmq-lca 单节点', () => {
  const { query, euler } = rmqLca({ nodes: ['X'], edges: [], root: 'X' });
  assert.equal(query('X', 'X'), 'X');
  assert.equal(euler.length, 1);
});

test('rmq-lca 钩子被调用', () => {
  const eulerVisits: string[] = [];
  let sparseBuilt = false;
  const { query } = rmqLca(G, {
    onEuler: (u) => eulerVisits.push(u),
    onSparseBuilt: () => {
      sparseBuilt = true;
    },
  });
  query('3', '5');
  assert.equal(eulerVisits.length, 2 * G.nodes.length - 1);
  assert.ok(sparseBuilt);
});
