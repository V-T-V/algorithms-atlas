import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMinTaps } from '../../src/algorithms/greedy/greedy-min-taps/impl.ts';

test('greedy-min-taps 经典用例 1', () => {
  assert.equal(greedyMinTaps(5, [3, 4, 1, 1, 0, 0]), 1);
});

test('greedy-min-taps 经典用例 2', () => {
  assert.equal(greedyMinTaps(3, [0, 0, 0, 0]), -1);
});

test('greedy-min-taps 经典用例 3', () => {
  assert.equal(greedyMinTaps(5, [1, 2, 1, 0, 2, 1]), 2);
});

test('greedy-min-taps n=0', () => {
  assert.equal(greedyMinTaps(0, [5]), 0);
});
