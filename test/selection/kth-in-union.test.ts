import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthInUnion } from '../../src/algorithms/selection/kth-in-union/impl.ts';

test('kthInUnion 交错数组', () => {
  const a = [1, 3, 5, 7, 9];
  const b = [2, 4, 6, 8, 10];
  for (let kk = 1; kk <= 10; kk++) {
    assert.equal(kthInUnion(a, b, kk), kk);
  }
});

test('kthInUnion 与合并排序一致', () => {
  const a = [1, 4, 7, 10];
  const b = [2, 3, 5, 8, 9, 11];
  const merged = [...a, ...b].sort((x, y) => x - y);
  for (let kk = 1; kk <= merged.length; kk++) {
    assert.equal(kthInUnion(a, b, kk), merged[kk - 1], `k=${kk}`);
  }
});

test('kthInUnion 含重复元素', () => {
  const a = [1, 2, 2, 3];
  const b = [2, 3, 4];
  const merged = [...a, ...b].sort((x, y) => x - y);
  for (let kk = 1; kk <= merged.length; kk++) {
    assert.equal(kthInUnion(a, b, kk), merged[kk - 1], `k=${kk}`);
  }
});

test('kthInUnion 一个数组为空', () => {
  assert.equal(kthInUnion([], [1, 2, 3], 2), 2);
  assert.equal(kthInUnion([5, 6], [], 1), 5);
});

test('kthInUnion 不修改原数组', () => {
  const a = [1, 2];
  const b = [3, 4];
  kthInUnion(a, b, 1);
  assert.deepEqual(a, [1, 2]);
  assert.deepEqual(b, [3, 4]);
});

test('kthInUnion 越界抛错', () => {
  assert.throws(() => kthInUnion([1], [2], 0));
  assert.throws(() => kthInUnion([1], [2], 3));
});
