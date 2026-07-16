import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthSmallestMatrix } from '../../src/algorithms/selection/kth-smallest-matrix/impl.ts';

test('kthSmallestMatrix 经典样例', () => {
  const m = [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ];
  assert.equal(kthSmallestMatrix(m, 1), 1);
  assert.equal(kthSmallestMatrix(m, 5), 11);
  assert.equal(kthSmallestMatrix(m, 8), 13);
  assert.equal(kthSmallestMatrix(m, 9), 15);
});

test('kthSmallestMatrix 与扁平排序一致', () => {
  const m = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];
  const flat = [...m.flat()].sort((a, b) => a - b);
  for (let kk = 1; kk <= 9; kk++) {
    assert.equal(kthSmallestMatrix(m, kk), flat[kk - 1], `k=${kk}`);
  }
});

test('kthSmallestMatrix 单行', () => {
  assert.equal(kthSmallestMatrix([[1, 2, 3, 4]], 3), 3);
});

test('kthSmallestMatrix 不修改原矩阵', () => {
  const m = [
    [1, 2],
    [3, 4],
  ];
  const copy = m.map((r) => [...r]);
  kthSmallestMatrix(m, 1);
  assert.deepEqual(m, copy);
});

test('kthSmallestMatrix 越界抛错', () => {
  assert.throws(() => kthSmallestMatrix([[1, 2]], 0));
  assert.throws(() => kthSmallestMatrix([[1, 2]], 3));
});
