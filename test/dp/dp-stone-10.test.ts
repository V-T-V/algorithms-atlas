import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStones } from '../../src/algorithms/dp/dp-stone-10/impl.ts';

test('stone 经典', () => {
  assert.equal(mergeStones([3, 1, 4, 1, 5]), 32);
});
test('stone 两堆', () => {
  assert.equal(mergeStones([2, 3]), 5);
});
test('stone 空', () => {
  assert.equal(mergeStones([]), 0);
});
test('stone 单堆', () => {
  assert.equal(mergeStones([7]), 0);
});
