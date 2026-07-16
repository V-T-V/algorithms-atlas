import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SegmentTreePoint } from '../../src/algorithms/ds/ds-segment-point/impl.ts';

test('初始 sum 全区间', () => {
  const t = new SegmentTreePoint([1, 2, 3, 4, 5]);
  assert.equal(t.query(0, 4), 15);
});

test('单点更新', () => {
  const t = new SegmentTreePoint([1, 2, 3, 4, 5]);
  t.pointUpdate(2, 100);
  assert.equal(t.query(0, 4), 112);
  assert.equal(t.query(0, 1), 3);
});

test('部分区间查询', () => {
  const t = new SegmentTreePoint([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.query(2, 5), 19); // 4+1+5+9
});

test('单元素区间', () => {
  const t = new SegmentTreePoint([3, 1, 4, 1, 5]);
  assert.equal(t.query(2, 2), 4);
});

test('单元素数组', () => {
  const t = new SegmentTreePoint([42]);
  assert.equal(t.query(0, 0), 42);
  t.pointUpdate(0, 100);
  assert.equal(t.query(0, 0), 100);
});
