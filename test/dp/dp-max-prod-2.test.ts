import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProduct } from '../../src/algorithms/dp/dp-max-prod-2/impl.ts';

test('max-prod LC152 例1', () => {
  assert.equal(maxProduct([2, 3, -2, 4]), 6);
});

test('max-prod LC152 例2', () => {
  assert.equal(maxProduct([-2, 0, -1]), 0);
});

test('max-prod 含两负', () => {
  assert.equal(maxProduct([2, 3, -2, 4, -1]), 48);
});

test('max-prod 单元素', () => {
  assert.equal(maxProduct([-3]), -3);
});
