import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dsuOnTree, type GraphInput } from '../../src/algorithms/graph/dsu-on-tree/impl.ts';

// 演示树
//   1(c1) - 2(c2) - 3(c2)
//    |
//   4(c1) - 5(c3)
//    |
//   6(c4) - 7(c1)
const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  values: [1, 2, 2, 1, 3, 4, 1],
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

test('dsu-on-tree 子树不同颜色数', () => {
  const { distinct } = dsuOnTree(G);
  assert.equal(distinct.get('3'), 1); // {c2}
  assert.equal(distinct.get('2'), 1); // {c2}
  assert.equal(distinct.get('5'), 1); // {c3}
  assert.equal(distinct.get('7'), 1); // {c1}
  assert.equal(distinct.get('6'), 2); // {c4,c1}
  assert.equal(distinct.get('4'), 3); // {c1,c3,c4}
  assert.equal(distinct.get('1'), 4); // {c1,c2,c3,c4}
});

test('dsu-on-tree 全同色', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    values: [5, 5, 5],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
    ],
    root: 'A',
  };
  const { distinct } = dsuOnTree(g);
  assert.equal(distinct.get('A'), 1);
  assert.equal(distinct.get('B'), 1);
  assert.equal(distinct.get('C'), 1);
});

test('dsu-on-tree 链', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    values: [1, 2, 3],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
    root: 'A',
  };
  const { distinct } = dsuOnTree(g);
  assert.equal(distinct.get('C'), 1);
  assert.equal(distinct.get('B'), 2);
  assert.equal(distinct.get('A'), 3);
});

test('dsu-on-tree 单节点', () => {
  const { distinct } = dsuOnTree({ nodes: ['X'], values: [9], edges: [], root: 'X' });
  assert.equal(distinct.get('X'), 1);
});

test('dsu-on-tree 钩子被调用', () => {
  const answers: string[] = [];
  let applyCount = 0;
  dsuOnTree(G, {
    onAnswer: (u) => answers.push(u),
    onApply: () => applyCount++,
  });
  assert.equal(answers.length, 7);
  assert.ok(applyCount >= 7, '每个节点至少被加入一次');
});
