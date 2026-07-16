import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeHash, type GraphInput } from '../../src/algorithms/graph/tree-hash/impl.ts';

test('tree-hash 同构有根树哈希相等', () => {
  // T1:        T2:
  //    1          a
  //   / \        / \
  //  2   3      b   c
  // /          /
  // 4          d
  // 两棵子树不同构（左子有孙子），所以 1 与 a 子哈希不同 → 整体不同构
  // 这里直接比较 1 与 a 的根哈希应不同
  const t1: GraphInput = {
    nodes: ['1', '2', '3', '4'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '4' },
    ],
    root: '1',
  };
  const flat: GraphInput = {
    nodes: ['1', '2', '3', '4'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '1', to: '4' },
    ],
    root: '1',
  };
  assert.notEqual(treeHash(t1).rootHash, treeHash(flat).rootHash);
});

test('tree-hash 真正同构的树哈希相等', () => {
  // 两棵形状完全相同（标签不同）的有根树
  const a: GraphInput = {
    nodes: ['1', '2', '3'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
    ],
    root: '1',
  };
  const b: GraphInput = {
    nodes: ['X', 'Y', 'Z'],
    edges: [
      { from: 'X', to: 'Y' },
      { from: 'X', to: 'Z' },
    ],
    root: 'X',
  };
  assert.equal(treeHash(a).rootHash, treeHash(b).rootHash);
});

test('tree-hash 叶子哈希相同', () => {
  const g: GraphInput = {
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '4' },
      { from: '2', to: '5' },
    ],
    root: '1',
  };
  const { hash } = treeHash(g);
  // 4、5 都是叶子，哈希应相等
  assert.equal(hash.get('4'), hash.get('5'));
  // 3 也是叶子
  assert.equal(hash.get('3'), hash.get('4'));
});

test('tree-hash 单点', () => {
  const { rootHash } = treeHash({ nodes: ['X'], edges: [], root: 'X' });
  assert.ok(rootHash > 0n);
});

test('tree-hash 钩子被调用', () => {
  const visits: string[] = [];
  let combineCount = 0;
  let rootCount = 0;
  const g: GraphInput = {
    nodes: ['1', '2', '3'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
    ],
    root: '1',
  };
  treeHash(g, {
    onVisit: (u) => visits.push(u),
    onCombine: () => {
      combineCount++;
    },
    onRoot: () => {
      rootCount++;
    },
  });
  assert.equal(visits.length, 3);
  assert.equal(combineCount, 3);
  assert.equal(rootCount, 1);
});
