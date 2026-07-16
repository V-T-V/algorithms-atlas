import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LCA, type TreeInput } from '../../src/algorithms/graph/graph-lca-3/impl.ts';

const t: TreeInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '3', to: '7' },
  ],
  root: '1',
};

test('lca 不同子树', () => {
  const lca = new LCA(t);
  assert.equal(lca.query('4', '6'), '1');
});

test('lca 同子树', () => {
  const lca = new LCA(t);
  assert.equal(lca.query('4', '5'), '2');
});

test('lca 祖先关系', () => {
  const lca = new LCA(t);
  assert.equal(lca.query('4', '2'), '2');
});

test('lca 自身', () => {
  const lca = new LCA(t);
  assert.equal(lca.query('7', '7'), '7');
});
