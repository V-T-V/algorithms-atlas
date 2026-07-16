import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSuffixArray } from '../../src/algorithms/string/str-suffix-array-3/impl.ts';

test('suffix array', () => {
  const { sa } = buildSuffixArray('banana');
  // 后缀排序：a, ana, anana, banana, na, nana
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
});

test('height array', () => {
  const { height } = buildSuffixArray('banana');
  // height[0] = 0
  assert.equal(height[0], 0);
});
