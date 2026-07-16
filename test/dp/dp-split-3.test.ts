import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integerBreak } from '../../src/algorithms/dp/dp-split-3/impl.ts';

test('split 10', () => {
  assert.equal(integerBreak(10), 36);
});
test('split 2', () => {
  assert.equal(integerBreak(2), 1);
});
test('split 3', () => {
  assert.equal(integerBreak(3), 2);
});
test('split 5', () => {
  assert.equal(integerBreak(5), 6);
});
