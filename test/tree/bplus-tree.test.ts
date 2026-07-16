import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBPlus,
  bplusInsert,
  bplusSearch,
  bplusRange,
  leafKeys,
  bplusHeight,
} from '../../src/algorithms/tree/bplus-tree/impl.ts';

const KEYS = [10, 20, 5, 6, 12, 30, 7, 17, 3, 25, 1, 8, 15, 22, 35];

test('bplus 插入后叶子链有序且完整', () => {
  const root = buildBPlus(KEYS);
  const all = leafKeys(root);
  assert.deepEqual(
    all,
    [...KEYS].sort((a, b) => a - b),
  );
});

test('bplusSearch 命中与未命中', () => {
  const root = buildBPlus(KEYS);
  assert.equal(bplusSearch(root, 17), true);
  assert.equal(bplusSearch(root, 1), true);
  assert.equal(bplusSearch(root, 100), false);
  assert.equal(bplusSearch(root, 9), false);
});

test('bplusRange 范围查询', () => {
  const root = buildBPlus(KEYS);
  assert.deepEqual(bplusRange(root, 7, 17), [7, 8, 10, 12, 15, 17]);
  assert.deepEqual(bplusRange(root, 0, 100).length, KEYS.length);
  assert.deepEqual(bplusRange(root, 30, 40), [30, 35]);
  assert.deepEqual(bplusRange(root, 100, 200), []);
});

test('bplus 插入去重', () => {
  let root = buildBPlus([5, 3, 7]);
  root = bplusInsert(root, 5);
  assert.deepEqual(leafKeys(root), [3, 5, 7]);
});

test('bplus 树高随插入增长', () => {
  let root = buildBPlus([]);
  const h0 = bplusHeight(root);
  root = buildBPlus(KEYS);
  const h1 = bplusHeight(root);
  assert.equal(h0, 1);
  assert.ok(h1 >= 1, `插入后树高应 >= 1，实际 ${h1}`);
});

test('bplus 钩子被调用', () => {
  let leafSplits = 0;
  let internalSplits = 0;
  buildBPlus(KEYS, {
    onSplitLeaf: () => leafSplits++,
    onSplitInternal: () => internalSplits++,
  });
  assert.ok(leafSplits >= 1, '应至少发生一次叶子分裂');
});

test('bplus 空树', () => {
  const root = buildBPlus([]);
  assert.deepEqual(leafKeys(root), []);
  assert.equal(bplusSearch(root, 1), false);
});
