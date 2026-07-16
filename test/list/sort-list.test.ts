import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortList, fromArray, toArray } from '../../src/algorithms/list/sort-list/impl.ts';

test('sortList 基本排序', () => {
  assert.deepEqual(toArray(sortList(fromArray([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(
    toArray(sortList(fromArray([5, 2, 8, 1, 9, 3, 7, 4, 6]))),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test('sortList 边界', () => {
  assert.equal(sortList(null), null);
  assert.deepEqual(toArray(sortList(fromArray([1]))), [1]);
  assert.deepEqual(toArray(sortList(fromArray([]))), []);
});

test('sortList 已有序 / 逆序', () => {
  assert.deepEqual(toArray(sortList(fromArray([1, 2, 3]))), [1, 2, 3]);
  assert.deepEqual(toArray(sortList(fromArray([3, 2, 1]))), [1, 2, 3]);
});

test('sortList 重复元素', () => {
  assert.deepEqual(toArray(sortList(fromArray([3, 1, 2, 1, 3]))), [1, 1, 2, 3, 3]);
});

test('sortList 钩子被调用', () => {
  let splits = 0;
  sortList(fromArray([4, 2, 1, 3]), { onSplit: () => splits++ });
  assert.ok(splits > 0);
});
