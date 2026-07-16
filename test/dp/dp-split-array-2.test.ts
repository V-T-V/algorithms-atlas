import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitArray } from '../../src/algorithms/dp/dp-split-array-2/impl.ts';

test('split-array LC410 例', () => {
  assert.equal(splitArray([7, 2, 5, 10, 8], 2), 18);
});

test('split-array m=1', () => {
  assert.equal(splitArray([1, 2, 3, 4], 1), 10);
});

test('split-array m=n', () => {
  assert.equal(splitArray([1, 4, 4], 3), 4);
});
