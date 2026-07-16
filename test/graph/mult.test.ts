import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mult, type GraphInput } from '../../src/algorithms/graph/mult/impl.ts';

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

test('mult 正确 LCA', () => {
  const { query } = mult(G);
  assert.equal(query('3', '5'), '1');
  assert.equal(query('3', '2'), '2');
  assert.equal(query('4', '5'), '4');
  assert.equal(query('3', '4'), '1');
});

test('mult 自身', () => {
  const { query } = mult(G);
  assert.equal(query('3', '3'), '3');
});

test('mult 深度正确', () => {
  const { depth } = mult(G);
  assert.equal(depth.get('1'), 0);
  assert.equal(depth.get('3'), 2);
  assert.equal(depth.get('5'), 2);
});

test('mult 与根', () => {
  const { query } = mult(G);
  assert.equal(query('5', '1'), '1');
});

test('mult 链式树深查', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
    root: 'A',
  };
  const { query } = mult(g);
  assert.equal(query('D', 'B'), 'B');
  assert.equal(query('D', 'A'), 'A');
});

test('mult 钩子被调用', () => {
  const visited: string[] = [];
  let tableBuilt = false;
  const { query } = mult(G, {
    onVisit: (u) => visited.push(u),
    onTableBuilt: () => {
      tableBuilt = true;
    },
  });
  query('3', '5');
  assert.equal(visited.length, 5);
  assert.ok(tableBuilt);
});
