import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchNearlySorted,
  type NearlySortedHooks,
} from '../../src/algorithms/searching/search-nearly-sorted/impl.ts';

const A = [6, 3, 7, 1, 5, 2, 8, 4];
test('searchNearlySorted 命中', () => {
  assert.equal(searchNearlySorted(A, 8), 6);
  assert.equal(searchNearlySorted(A, 6), 0);
  assert.equal(searchNearlySorted(A, 4), 7);
});
test('searchNearlySorted 未命中', () => {
  assert.equal(searchNearlySorted(A, 100), -1);
  assert.equal(searchNearlySorted([], 1), -1);
});
test('searchNearlySorted 钩子', () => {
  let c = 0;
  searchNearlySorted(A, 8, 2, { onCheck: () => c++ } as NearlySortedHooks);
  assert.ok(c >= 1);
});
