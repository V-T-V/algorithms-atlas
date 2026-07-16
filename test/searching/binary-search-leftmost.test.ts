import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchLeftmost } from '../../src/algorithms/searching/binary-search-leftmost/impl.ts';

const ARR = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];

test('binarySearchLeftmost 重复取最左', () => {
  assert.equal(binarySearchLeftmost(ARR, 5), 7);
  assert.equal(binarySearchLeftmost(ARR, 2), 1);
  assert.equal(binarySearchLeftmost(ARR, 4), 5);
  assert.equal(binarySearchLeftmost(ARR, 1), 0);
  assert.equal(binarySearchLeftmost(ARR, 6), 11);
});

test('binarySearchLeftmost 不存在返回 -1', () => {
  assert.equal(binarySearchLeftmost(ARR, 0), -1);
  assert.equal(binarySearchLeftmost(ARR, 7), -1);
  assert.equal(binarySearchLeftmost(ARR, 2.5), -1);
});

test('binarySearchLeftmost 边界', () => {
  assert.equal(binarySearchLeftmost([], 1), -1);
  assert.equal(binarySearchLeftmost([5], 5), 0);
  assert.equal(binarySearchLeftmost([5], 3), -1);
  assert.equal(binarySearchLeftmost([5, 5, 5], 5), 0);
});

test('binarySearchLeftmost 探测次数 ≤ ⌈log n⌉', () => {
  let probes = 0;
  binarySearchLeftmost(ARR, 5, { onProbe: () => probes++ });
  assert.ok(probes >= 1 && probes <= 5);
});
