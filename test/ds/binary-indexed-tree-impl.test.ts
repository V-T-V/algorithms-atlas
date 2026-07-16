import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BITRange } from '../../src/algorithms/ds/binary-indexed-tree-impl/impl.ts';

test('BITRange 区间加 + 区间和', () => {
  const bit = new BITRange(8);
  bit.rangeAdd(1, 5, 3);
  // [3,3,3,3,3,0,0,0]
  assert.equal(bit.rangeSum(1, 8), 15);
  assert.equal(bit.rangeSum(6, 8), 0);
  assert.equal(bit.rangeSum(1, 5), 15);
});

test('BITRange fromArray', () => {
  const bit = BITRange.fromArray([1, 2, 3, 4, 5]);
  assert.equal(bit.rangeSum(1, 5), 15);
  assert.equal(bit.rangeSum(2, 4), 9);
  assert.equal(bit.pointValue(3), 3);
});

test('BITRange 多次区间加', () => {
  const bit = new BITRange(8);
  bit.rangeAdd(1, 5, 3);
  bit.rangeAdd(3, 7, 2);
  // [3,3,5,5,5,2,2,0]
  assert.equal(bit.rangeSum(1, 8), 25);
  assert.equal(bit.rangeSum(3, 5), 15);
  assert.equal(bit.pointValue(1), 3);
  assert.equal(bit.pointValue(3), 5);
  assert.equal(bit.pointValue(6), 2);
  assert.equal(bit.pointValue(8), 0);
});

test('BITRange 负数增量', () => {
  const bit = new BITRange(8);
  bit.rangeAdd(1, 8, 5);
  bit.rangeAdd(4, 6, -3);
  // [5,5,5,2,2,2,5,5]
  assert.equal(bit.rangeSum(1, 8), 31);
  assert.equal(bit.pointValue(5), 2);
});

test('BITRange 单点值正确', () => {
  const bit = new BITRange(5);
  bit.rangeAdd(2, 4, 10);
  assert.equal(bit.pointValue(1), 0);
  assert.equal(bit.pointValue(2), 10);
  assert.equal(bit.pointValue(3), 10);
  assert.equal(bit.pointValue(4), 10);
  assert.equal(bit.pointValue(5), 0);
});

test('BITRange 钩子被调用', () => {
  let updates = 0;
  let queries = 0;
  const bit = new BITRange(4);
  bit.rangeAdd(1, 2, 5, { onPointUpdate: () => updates++ });
  bit.rangeSum(1, 2, { onPrefixQuery: () => queries++ });
  assert.ok(updates >= 1, '应至少更新一次');
  assert.ok(queries >= 1, '应至少查询一次');
});

test('BITRange 越界与空区间', () => {
  const bit = new BITRange(4);
  bit.rangeAdd(3, 2, 5); // 空
  assert.equal(bit.rangeSum(1, 4), 0);
  assert.equal(bit.rangeSum(3, 2), 0); // 空
});
