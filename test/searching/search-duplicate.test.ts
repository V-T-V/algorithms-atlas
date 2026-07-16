import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchDuplicate } from '../../src/algorithms/searching/search-duplicate/impl.ts';

const ARR = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];

test('searchDuplicate 命中区间与计数', () => {
  assert.deepEqual(searchDuplicate(ARR, 5), { found: true, first: 7, last: 10, count: 4 });
  assert.deepEqual(searchDuplicate(ARR, 2), { found: true, first: 1, last: 3, count: 3 });
  assert.deepEqual(searchDuplicate(ARR, 1), { found: true, first: 0, last: 0, count: 1 });
  assert.deepEqual(searchDuplicate(ARR, 6), { found: true, first: 11, last: 11, count: 1 });
});

test('searchDuplicate 未命中', () => {
  assert.deepEqual(searchDuplicate(ARR, 0), { found: false, first: -1, last: -1, count: 0 });
  assert.deepEqual(searchDuplicate(ARR, 7), { found: false, first: -1, last: -1, count: 0 });
  assert.deepEqual(searchDuplicate(ARR, 2.5), { found: false, first: -1, last: -1, count: 0 });
});

test('searchDuplicate 边界', () => {
  assert.deepEqual(searchDuplicate([], 1), { found: false, first: -1, last: -1, count: 0 });
  assert.deepEqual(searchDuplicate([5], 5), { found: true, first: 0, last: 0, count: 1 });
});

test('searchDuplicate 钩子：左右两阶段均触发', () => {
  let left = 0;
  let right = 0;
  searchDuplicate(ARR, 5, {
    onLeftProbe: () => left++,
    onRightProbe: () => right++,
  });
  assert.ok(left >= 1);
  assert.ok(right >= 1);
});
