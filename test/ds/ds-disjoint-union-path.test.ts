import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DsuPath } from '../../src/algorithms/ds/ds-disjoint-union-path/impl.ts';

test('DsuPath 基本', () => {
  const dsu = new DsuPath(5);
  assert.equal(dsu.count, 5);
  assert.equal(dsu.find(0), 0);
  assert.equal(dsu.connected(0, 1), false);
});

test('DsuPath union', () => {
  const dsu = new DsuPath(5);
  dsu.union(0, 1);
  assert.equal(dsu.connected(0, 1), true);
  assert.equal(dsu.count, 4);
  dsu.union(2, 3);
  assert.equal(dsu.count, 3);
  dsu.union(1, 2); // 合并两个集合
  assert.equal(dsu.connected(0, 3), true);
  assert.equal(dsu.count, 2);
});

test('DsuPath 重复 union', () => {
  const dsu = new DsuPath(3);
  assert.equal(dsu.union(0, 1), true);
  assert.equal(dsu.union(0, 1), false); // 已同集合
  assert.equal(dsu.count, 2);
});

test('DsuPath 路径压缩生效', () => {
  const dsu = new DsuPath(6);
  // 建一条链 0-1-2-3-4-5（每次 union 把第一个挂第二个下）
  dsu.union(0, 1);
  dsu.union(1, 2);
  dsu.union(2, 3);
  dsu.union(3, 4);
  dsu.union(4, 5);
  // find(0) 后，0 应直接挂根
  dsu.find(0);
  // 再 find(0) 应是 O(1)
  const root = dsu.find(0);
  assert.equal(dsu.parent[0], root);
});

test('DsuPath 全连通', () => {
  const dsu = new DsuPath(4);
  dsu.union(0, 1);
  dsu.union(2, 3);
  dsu.union(0, 2);
  assert.equal(dsu.count, 1);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) assert.equal(dsu.connected(i, j), true);
});

test('DsuPath 单元素', () => {
  const dsu = new DsuPath(1);
  assert.equal(dsu.find(0), 0);
  assert.equal(dsu.count, 1);
});
