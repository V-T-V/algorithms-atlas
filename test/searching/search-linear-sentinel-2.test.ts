import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sentinelLinearSearch2,
  type LinearSentinel2Hooks,
} from '../../src/algorithms/searching/search-linear-sentinel-2/impl.ts';

const A = [9, 3, 7, 1, 5, 11, 13, 2, 8, 4];
test('sentinelLinearSearch2 命中', () => {
  assert.equal(sentinelLinearSearch2(A, 8), 8);
  assert.equal(sentinelLinearSearch2(A, 9), 0);
  assert.equal(sentinelLinearSearch2(A, 4), 9);
});
test('sentinelLinearSearch2 未命中', () => {
  assert.equal(sentinelLinearSearch2(A, 100), -1);
  assert.equal(sentinelLinearSearch2([], 1), -1);
});
test('sentinelLinearSearch2 不修改原数组', () => {
  const input = [3, 1, 2];
  sentinelLinearSearch2(input, 2);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sentinelLinearSearch2 钩子', () => {
  let c = 0;
  sentinelLinearSearch2([3, 1, 2], 2, { onCompare: () => c++ } as LinearSentinel2Hooks);
  assert.ok(c >= 1);
});
