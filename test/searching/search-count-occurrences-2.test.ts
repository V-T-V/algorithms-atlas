import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countOccurrences2,
  type CountOcc2Hooks,
} from '../../src/algorithms/searching/search-count-occurrences-2/impl.ts';

const A = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6];
test('countOccurrences2 统计', () => {
  assert.equal(countOccurrences2(A, 5), 4);
  assert.equal(countOccurrences2(A, 2), 3);
  assert.equal(countOccurrences2(A, 1), 1);
  assert.equal(countOccurrences2(A, 6), 1);
});
test('countOccurrences2 不存在', () => {
  assert.equal(countOccurrences2(A, 0), 0);
  assert.equal(countOccurrences2(A, 7), 0);
  assert.equal(countOccurrences2(A, 2.5), 0);
});
test('countOccurrences2 边界', () => {
  assert.equal(countOccurrences2([], 1), 0);
  assert.equal(countOccurrences2([5], 5), 1);
  assert.equal(countOccurrences2([5], 3), 0);
});
test('countOccurrences2 钩子', () => {
  let c = 0;
  countOccurrences2(A, 5, { onBound: () => c++ } as CountOcc2Hooks);
  assert.ok(c >= 1);
});
