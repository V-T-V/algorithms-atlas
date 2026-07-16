import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextGreater, prevGreater } from '../../src/algorithms/ds/ds-mono-stack-2/impl.ts';

test('next greater', () => {
  assert.deepEqual(nextGreater([2, 1, 5, 6, 2, 3]), [2, 2, 3, -1, 5, -1]);
});

test('prev greater', () => {
  assert.deepEqual(prevGreater([2, 1, 5, 6, 2, 3]), [-1, 0, -1, -1, 3, 3]);
});
