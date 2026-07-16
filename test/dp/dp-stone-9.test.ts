import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStones } from '../../src/algorithms/dp/dp-stone-9/impl.ts';

test('merge-stones 经典例 [3,1,4,1,5]', () => {
  assert.equal(mergeStones([3, 1, 4, 1, 5]), 25);
});

test('merge-stones 两堆', () => {
  assert.equal(mergeStones([1, 2]), 3);
});

test('merge-stones 单堆', () => {
  assert.equal(mergeStones([5]), 0);
});

test('merge-stones [1,2,3]', () => {
  // (1+2) -> 3, then 3+3=6: total 3+6=9 OR (2+3)=5 then 1+5=6: total 5+6=11 -> 9
  assert.equal(mergeStones([1, 2, 3]), 9);
});
