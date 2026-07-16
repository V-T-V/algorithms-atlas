import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FenwickPoint } from '../../src/algorithms/ds/ds-fenwick-point/impl.ts';

test('初始区间和', () => {
  const f = FenwickPoint.fromArray([1, 2, 3, 4, 5]);
  assert.equal(f.rangeSum(1, 5), 15);
  assert.equal(f.rangeSum(2, 4), 9);
});

test('单点加后区间和', () => {
  const f = FenwickPoint.fromArray([1, 2, 3, 4, 5]);
  f.pointAdd(3, 100);
  assert.equal(f.rangeSum(1, 5), 115);
  assert.equal(f.rangeSum(1, 2), 3);
});

test('单元素数组', () => {
  const f = FenwickPoint.fromArray([42]);
  assert.equal(f.rangeSum(1, 1), 42);
  f.pointAdd(1, 8);
  assert.equal(f.rangeSum(1, 1), 50);
});

test('部分和累加', () => {
  const f = FenwickPoint.fromArray([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(f.rangeSum(2, 5), 11); // 1+4+1+5
});

test('多次加', () => {
  const f = FenwickPoint.fromArray([0, 0, 0, 0]);
  f.pointAdd(1, 5);
  f.pointAdd(2, 5);
  f.pointAdd(3, 5);
  assert.equal(f.rangeSum(1, 4), 15);
});
