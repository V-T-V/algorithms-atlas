import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PersistentSegmentTree } from '../../src/algorithms/ds/ds-persistent-seg-2/impl.ts';

test('第 1 小（最小）', () => {
  const t = new PersistentSegmentTree([3, 1, 4, 1, 5, 9, 2, 6]);
  [3, 1, 4, 1, 5, 9, 2, 6].forEach((v) => t.insert(v));
  assert.equal(t.kthSmallest(1, 8, 1), 1);
});

test('第 n 小（最大）', () => {
  const t = new PersistentSegmentTree([3, 1, 4, 1, 5, 9, 2, 6]);
  [3, 1, 4, 1, 5, 9, 2, 6].forEach((v) => t.insert(v));
  assert.equal(t.kthSmallest(1, 8, 8), 9);
});

test('子区间第 k 小', () => {
  const t = new PersistentSegmentTree([3, 1, 4, 1, 5, 9, 2, 6]);
  [3, 1, 4, 1, 5, 9, 2, 6].forEach((v) => t.insert(v));
  // 区间 [5,8] = [5,9,2,6]，第 2 小 = 5
  assert.equal(t.kthSmallest(5, 8, 2), 5);
});

test('前缀第 k 小', () => {
  const t = new PersistentSegmentTree([5, 3, 8, 1, 9]);
  [5, 3, 8, 1, 9].forEach((v) => t.insert(v));
  // 前 3 个 [5,3,8]，第 2 小 = 5
  assert.equal(t.kthSmallest(1, 3, 2), 5);
});

test('单元素', () => {
  const t = new PersistentSegmentTree([42]);
  [42].forEach((v) => t.insert(v));
  assert.equal(t.kthSmallest(1, 1, 1), 42);
});
