import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, search, contains } from '../../src/algorithms/tree/tree-bst-search/impl.ts';

test('找到存在的键', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.equal(search(root, 40)!.value, 40);
  assert.equal(search(root, 80)!.value, 80);
  assert.equal(search(root, 50)!.value, 50);
});

test('不存在的键返回 null', () => {
  const root = buildBST([50, 30, 70]);
  assert.equal(search(root, 100), null);
  assert.equal(search(root, 10), null);
  assert.equal(search(root, 45), null);
});

test('空树查找', () => {
  assert.equal(search(null, 5), null);
});

test('contains 一致', () => {
  const root = buildBST([5, 3, 7, 2, 4]);
  assert.equal(contains(root, 4), true);
  assert.equal(contains(root, 6), false);
});

test('回调触发', () => {
  let calls = 0;
  const root = buildBST([5, 3, 7]);
  search(root, 3, { onCompare: () => calls++ });
  assert.ok(calls >= 1);
});

test('单节点树', () => {
  const root = buildBST([5]);
  assert.equal(search(root, 5)!.value, 5);
  assert.equal(search(root, 3), null);
});
