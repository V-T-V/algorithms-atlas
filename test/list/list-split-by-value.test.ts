import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  splitByValue,
} from '../../src/algorithms/list/list-split-by-value/impl.ts';

test('splitByValue 分割', () => {
  const r = splitByValue(buildList([3, 1, 4, 1, 5, 9, 2, 6]), 4);
  assert.deepEqual(listToArray(r.left), [3, 1, 1, 2]);
  assert.deepEqual(listToArray(r.right), [4, 5, 9, 6]);
});

test('splitByValue 全在左', () => {
  const r = splitByValue(buildList([1, 2, 3]), 10);
  assert.deepEqual(listToArray(r.left), [1, 2, 3]);
  assert.equal(r.right, null);
});

test('splitByValue 全在右', () => {
  const r = splitByValue(buildList([5, 6]), 1);
  assert.equal(r.left, null);
  assert.deepEqual(listToArray(r.right), [5, 6]);
});
