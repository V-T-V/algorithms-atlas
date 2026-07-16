import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  slidingWindowMax,
  slidingWindowMin,
} from '../../src/algorithms/ds/ds-mono-queue-2/impl.ts';

test('sliding window max', () => {
  assert.deepEqual(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
});

test('sliding window min', () => {
  assert.deepEqual(slidingWindowMin([1, 3, -1, -3, 5, 3, 6, 7], 3), [-1, -3, -3, -3, 3, 3]);
});
