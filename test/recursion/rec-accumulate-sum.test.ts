import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recSum, recSumRange } from '../../src/algorithms/recursion/rec-accumulate-sum/impl.ts';

test('recSum 基本', () => {
  assert.equal(recSum([1, 2, 3, 4, 5]), 15);
  assert.equal(recSum([10]), 10);
  assert.equal(recSum([]), 0);
});

test('recSum 负数', () => {
  assert.equal(recSum([-1, -2, 3]), 0);
});

test('recSumRange 与 recSum 一致', () => {
  assert.equal(recSumRange([1, 2, 3, 4, 5, 6]), 21);
  assert.equal(recSumRange([]), 0);
});

test('recSum 钩子', () => {
  let calls = 0;
  recSum([1, 2, 3], { onRecurse: () => calls++ });
  assert.equal(calls, 3);
});
