import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSuffixArray } from '../../src/algorithms/parsing/parse-suffix-array/impl.ts';

test('suffix-array banana', () => {
  assert.deepEqual(buildSuffixArray('banana'), [5, 3, 1, 0, 4, 2]);
});
test('suffix-array 空', () => {
  assert.deepEqual(buildSuffixArray(''), []);
});
