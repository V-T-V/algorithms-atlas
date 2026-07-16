import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FenwickRange } from '../../src/algorithms/ds/ds-fenwick-range/impl.ts';

test('初始单点查询', () => {
  const f = FenwickRange.fromArray([1, 2, 3, 4, 5]);
  assert.equal(f.pointQuery(1), 1);
  assert.equal(f.pointQuery(3), 3);
  assert.equal(f.pointQuery(5), 5);
});

test('区间加后单点查询', () => {
  const f = FenwickRange.fromArray([1, 2, 3, 4, 5]);
  f.rangeAdd(2, 4, 10);
  assert.equal(f.pointQuery(1), 1);
  assert.equal(f.pointQuery(2), 12); // 2+10
  assert.equal(f.pointQuery(3), 13);
  assert.equal(f.pointQuery(4), 14);
  assert.equal(f.pointQuery(5), 5);
});

test('全数组加', () => {
  const f = FenwickRange.fromArray([1, 2, 3]);
  f.rangeAdd(1, 3, 5);
  assert.equal(f.pointQuery(1), 6);
  assert.equal(f.pointQuery(2), 7);
  assert.equal(f.pointQuery(3), 8);
});

test('负数加', () => {
  const f = FenwickRange.fromArray([10, 10, 10]);
  f.rangeAdd(1, 2, -3);
  assert.equal(f.pointQuery(1), 7);
  assert.equal(f.pointQuery(2), 7);
  assert.equal(f.pointQuery(3), 10);
});

test('单点单次更新', () => {
  const f = FenwickRange.fromArray([5, 5, 5]);
  f.rangeAdd(2, 2, 100);
  assert.equal(f.pointQuery(1), 5);
  assert.equal(f.pointQuery(2), 105);
  assert.equal(f.pointQuery(3), 5);
});
