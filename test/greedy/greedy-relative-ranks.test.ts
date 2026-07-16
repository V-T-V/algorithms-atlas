import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyRelativeRanks } from '../../src/algorithms/greedy/greedy-relative-ranks/impl.ts';

test('greedy-relative-ranks 基本用例', () => {
  assert.deepEqual(greedyRelativeRanks([5, 4, 3, 2, 1]), [
    'Gold Medal',
    'Silver Medal',
    'Bronze Medal',
    '4',
    '5',
  ]);
});

test('greedy-relative-ranks 乱序', () => {
  assert.deepEqual(greedyRelativeRanks([10, 3, 8, 9, 4]), [
    'Gold Medal',
    '5',
    'Bronze Medal',
    'Silver Medal',
    '4',
  ]);
});

test('greedy-relative-ranks 单人', () => {
  assert.deepEqual(greedyRelativeRanks([7]), ['Gold Medal']);
});
