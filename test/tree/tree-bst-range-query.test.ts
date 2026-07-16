import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, rangeQuery } from '../../src/algorithms/tree/tree-bst-range-query/impl.ts';

test('范围内的所有键', () => {
  const root = buildBST([50, 30, 70, 20, 40, 60, 80]);
  assert.deepEqual(rangeQuery(root, 30, 60), [30, 40, 50, 60]);
});

test('单点范围', () => {
  const root = buildBST([5, 3, 7]);
  assert.deepEqual(rangeQuery(root, 5, 5), [5]);
});

test('范围无命中', () => {
  const root = buildBST([10, 20, 30]);
  assert.deepEqual(rangeQuery(root, 100, 200), []);
});

test('全范围', () => {
  const root = buildBST([50, 30, 70, 20, 40]);
  assert.deepEqual(rangeQuery(root, -Infinity, Infinity), [20, 30, 40, 50, 70]);
});

test('空树', () => {
  assert.deepEqual(rangeQuery(null, 1, 10), []);
});

test('lo > hi 抛错', () => {
  const root = buildBST([5, 3, 7]);
  assert.throws(() => rangeQuery(root, 10, 1), RangeError);
});

test('回调触发', () => {
  let visits = 0;
  const root = buildBST([5, 3, 7]);
  rangeQuery(root, 1, 10, { onVisit: () => visits++ });
  assert.ok(visits >= 3);
});
