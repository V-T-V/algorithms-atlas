import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tallestBillboard } from '../../src/algorithms/dp/dp-tallest-billboard/impl.ts';

test('tallest-billboard LeetCode 956 例 1', () => {
  assert.equal(tallestBillboard([1, 2, 3, 6]), 6);
});

test('tallest-billboard LeetCode 956 例 2', () => {
  assert.equal(tallestBillboard([1, 2, 3, 4, 5, 6]), 10);
});

test('tallest-billboard LeetCode 956 例 3', () => {
  assert.equal(tallestBillboard([1, 2]), 0);
});

test('tallest-billboard 单根', () => {
  assert.equal(tallestBillboard([5]), 0);
});

test('tallest-billboard 空', () => {
  assert.equal(tallestBillboard([]), 0);
});
