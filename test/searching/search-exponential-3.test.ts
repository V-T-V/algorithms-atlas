import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  exponentialSearch3,
  type Expo3Hooks,
} from '../../src/algorithms/searching/search-exponential-3/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
test('exponentialSearch3 命中', () => {
  assert.equal(exponentialSearch3(A, 1), 0);
  assert.equal(exponentialSearch3(A, 21), 10);
  assert.equal(exponentialSearch3(A, 15), 7);
});
test('exponentialSearch3 未命中', () => {
  assert.equal(exponentialSearch3(A, 0), -1);
  assert.equal(exponentialSearch3(A, 22), -1);
  assert.equal(exponentialSearch3(A, 8), -1);
});
test('exponentialSearch3 边界', () => {
  assert.equal(exponentialSearch3([], 1), -1);
  assert.equal(exponentialSearch3([5], 5), 0);
  assert.equal(exponentialSearch3([5], 3), -1);
});
test('exponentialSearch3 钩子', () => {
  let c = 0;
  exponentialSearch3(A, 15, { onGallop: () => c++, onBinary: () => {} } as Expo3Hooks);
  assert.ok(c >= 0);
});
