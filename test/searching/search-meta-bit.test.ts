import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  metaBitSearch,
  type MetaBitHooks,
} from '../../src/algorithms/searching/search-meta-bit/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-meta-bit 命中', () => {
  assert.equal(metaBitSearch(ARR, 1), 0);
  assert.equal(metaBitSearch(ARR, 21), 10);
  assert.equal(metaBitSearch(ARR, 15), 7);
  assert.equal(metaBitSearch(ARR, 11), 5);
});
test('search-meta-bit 未命中', () => {
  assert.equal(metaBitSearch(ARR, 0), -1);
  assert.equal(metaBitSearch(ARR, 22), -1);
  assert.equal(metaBitSearch(ARR, 8), -1);
});
test('search-meta-bit 边界', () => {
  assert.equal(metaBitSearch([], 1), -1);
  assert.equal(metaBitSearch([5], 5), 0);
  assert.equal(metaBitSearch([5], 3), -1);
});
test('search-meta-bit 钩子', () => {
  let c = 0;
  metaBitSearch(ARR, 15, { onTry: () => c++ } as MetaBitHooks);
  assert.ok(c >= 1);
});
