import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGameV } from '../../src/algorithms/dp/dp-stone-game-v/impl.ts';

test('stone-game-v LeetCode 1563 例 1', () => {
  assert.equal(stoneGameV([6, 2, 3, 4, 5, 5]), 18);
});

test('stone-game-v LeetCode 1563 例 2', () => {
  assert.equal(stoneGameV([7, 7, 7, 7, 7, 7, 7]), 28);
});

test('stone-game-v LeetCode 1563 例 3', () => {
  assert.equal(stoneGameV([4]), 0);
});

test('stone-game-v 两堆', () => {
  assert.equal(stoneGameV([3, 3]), 3);
});

test('stone-game-v 空', () => {
  assert.equal(stoneGameV([]), 0);
});
