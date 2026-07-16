import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recProduct } from '../../src/algorithms/recursion/rec-accumulate-product/impl.ts';

test('recProduct 基本', () => {
  assert.equal(recProduct([2, 3, 4, 5]), 120);
  assert.equal(recProduct([7]), 7);
  assert.equal(recProduct([]), 1);
});

test('recProduct 含 1', () => {
  assert.equal(recProduct([1, 1, 1, 5]), 5);
});

test('recProduct 含 0', () => {
  assert.equal(recProduct([1, 2, 0, 4]), 0);
});

test('recProduct 钩子', () => {
  let calls = 0;
  recProduct([1, 2, 3], { onRecurse: () => calls++ });
  assert.equal(calls, 3);
});
