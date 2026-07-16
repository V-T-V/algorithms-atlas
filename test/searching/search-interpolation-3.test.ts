import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  interpolationSearch3,
  type Interp3Hooks,
} from '../../src/algorithms/searching/search-interpolation-3/impl.ts';

const A = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
test('interpolationSearch3 命中', () => {
  assert.equal(interpolationSearch3(A, 10), 0);
  assert.equal(interpolationSearch3(A, 100), 9);
  assert.equal(interpolationSearch3(A, 70), 6);
  assert.equal(interpolationSearch3(A, 50), 4);
});
test('interpolationSearch3 未命中', () => {
  assert.equal(interpolationSearch3(A, 5), -1);
  assert.equal(interpolationSearch3(A, 105), -1);
  assert.equal(interpolationSearch3(A, 55), -1);
});
test('interpolationSearch3 边界', () => {
  assert.equal(interpolationSearch3([], 1), -1);
  assert.equal(interpolationSearch3([5], 5), 0);
  assert.equal(interpolationSearch3([5], 3), -1);
});
test('interpolationSearch3 钩子', () => {
  let c = 0;
  interpolationSearch3(A, 70, { onProbe: () => c++ } as Interp3Hooks);
  assert.ok(c >= 1);
});
