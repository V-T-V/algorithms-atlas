import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChangeCount } from '../../src/algorithms/dp/dp-coin-change-count/impl.ts';

test('coin-change-count LeetCode 518 例 1', () => {
  assert.equal(coinChangeCount([1, 2, 5], 5), 4);
});

test('coin-change-count LeetCode 518 例 2', () => {
  assert.equal(coinChangeCount([2], 3), 0);
});

test('coin-change-count LeetCode 518 例 3', () => {
  assert.equal(coinChangeCount([10], 10), 1);
});

test('coin-change-count amount=0', () => {
  assert.equal(coinChangeCount([1, 2, 5], 0), 1);
});

test('coin-change-count 单面额', () => {
  assert.equal(coinChangeCount([1], 4), 1);
});
