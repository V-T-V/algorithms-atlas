import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestArithSequence } from '../../src/algorithms/dp/dp-longest-arithmetic/impl.ts';

test('longest-arith LeetCode 1027 例', () => {
  assert.equal(longestArithSequence([3, 6, 9, 12]), 4);
  assert.equal(longestArithSequence([9, 4, 7, 2, 10]), 3);
  assert.equal(longestArithSequence([20, 1, 15, 3, 10, 5, 8]), 4);
});

test('longest-arith 两元素', () => {
  assert.equal(longestArithSequence([5, 1]), 2);
});

test('longest-arith 单元素', () => {
  assert.equal(longestArithSequence([7]), 1);
});

test('longest-arith 空数组', () => {
  assert.equal(longestArithSequence([]), 0);
});

test('longest-arith 负公差', () => {
  assert.equal(longestArithSequence([10, 7, 4, 1]), 4);
});

test('longest-arith 钩子', () => {
  let checks = 0;
  longestArithSequence([3, 6, 9], { onCheck: () => checks++ });
  assert.equal(checks, 3); // (1,0),(2,0),(2,1)
});
