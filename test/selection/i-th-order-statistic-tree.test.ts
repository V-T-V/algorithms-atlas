import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOST,
  insert,
  osSelect,
  treeSize,
} from '../../src/algorithms/selection/i-th-order-statistic-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/i-th-order-statistic-tree/trace.ts';

test('osSelect 与排序一致', () => {
  const arr = [15, 6, 18, 3, 10, 13, 20, 8];
  const tree = buildOST(arr);
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 1; k <= arr.length; k++) {
    assert.equal(osSelect(tree, k), sorted[k - 1], `k=${k}`);
  }
});

test('osSelect 找最小与最大', () => {
  const tree = buildOST([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(osSelect(tree, 1), 20);
  assert.equal(osSelect(tree, 7), 80);
});

test('insert 维护 size 正确', () => {
  let root = buildOST([10, 5, 15]);
  assert.equal(treeSize(root), 3);
  root = insert(root, 3);
  assert.equal(treeSize(root), 4);
  assert.equal(root?.left?.size, 2); // 5 的子树含 5,3
});

test('osSelect 越界抛错', () => {
  const tree = buildOST([1, 2, 3]);
  assert.throws(() => osSelect(tree, 0));
  assert.throws(() => osSelect(tree, 4));
});

test('osSelect 空树抛错', () => {
  assert.throws(() => osSelect(null, 1));
});

test('osSelect 插入重复值被忽略', () => {
  const tree = buildOST([5, 5, 5]);
  assert.equal(treeSize(tree), 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '终帧应有 tree');
});
