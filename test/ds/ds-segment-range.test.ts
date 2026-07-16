import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SegmentTreeRange } from '../../src/algorithms/ds/ds-segment-range/impl.ts';

test('初始 max 全区间', () => {
  const t = new SegmentTreeRange([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.query(0, 7), 9);
});

test('区间赋值后 max 更新', () => {
  const t = new SegmentTreeRange([3, 1, 4, 1, 5, 9, 2, 6]);
  t.rangeUpdate(5, 5, 0);
  assert.equal(t.query(0, 7), 6);
});

test('区间赋值整个数组', () => {
  const t = new SegmentTreeRange([3, 1, 4, 1, 5, 9, 2, 6]);
  t.rangeUpdate(0, 7, 7);
  assert.equal(t.query(0, 7), 7);
  assert.equal(t.query(3, 5), 7);
});

test('部分区间赋值', () => {
  const t = new SegmentTreeRange([1, 2, 3, 4, 5]);
  t.rangeUpdate(1, 3, 100);
  assert.equal(t.query(0, 4), 100);
  assert.equal(t.query(0, 0), 1);
  assert.equal(t.query(4, 4), 5);
});

test('单元素数组', () => {
  const t = new SegmentTreeRange([42]);
  assert.equal(t.query(0, 0), 42);
  t.rangeUpdate(0, 0, 99);
  assert.equal(t.query(0, 0), 99);
});
