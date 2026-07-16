import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchInsertPos } from '../../src/algorithms/searching/search-insert-pos/impl.ts';

const ARR = [1, 3, 5, 6, 8, 10];

test('searchInsertPos 已存在', () => {
  assert.deepEqual(searchInsertPos(ARR, 5), { pos: 2, exists: true });
  assert.deepEqual(searchInsertPos(ARR, 1), { pos: 0, exists: true });
  assert.deepEqual(searchInsertPos(ARR, 10), { pos: 5, exists: true });
});

test('searchInsertPos 不存在 - 中间', () => {
  assert.deepEqual(searchInsertPos(ARR, 2), { pos: 1, exists: false });
  assert.deepEqual(searchInsertPos(ARR, 7), { pos: 4, exists: false });
});

test('searchInsertPos 不存在 - 首尾', () => {
  assert.deepEqual(searchInsertPos(ARR, 0), { pos: 0, exists: false });
  assert.deepEqual(searchInsertPos(ARR, 11), { pos: 6, exists: false });
});

test('searchInsertPos 边界', () => {
  assert.deepEqual(searchInsertPos([], 1), { pos: 0, exists: false });
  assert.deepEqual(searchInsertPos([5], 5), { pos: 0, exists: true });
  assert.deepEqual(searchInsertPos([5], 3), { pos: 0, exists: false });
});

test('searchInsertPos 钩子探测次数 ≤ ⌈log n⌉', () => {
  let probes = 0;
  searchInsertPos(ARR, 7, { onProbe: () => probes++ });
  assert.ok(probes >= 1 && probes <= 4);
});
