import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fibonacciSearch3,
  type Fib3Hooks,
} from '../../src/algorithms/searching/search-fibonacci-3/impl.ts';

const A = [10, 22, 35, 40, 54, 62, 78, 81, 92, 99];
test('fibonacciSearch3 命中', () => {
  assert.equal(fibonacciSearch3(A, 10), 0);
  assert.equal(fibonacciSearch3(A, 99), 9);
  assert.equal(fibonacciSearch3(A, 78), 6);
  assert.equal(fibonacciSearch3(A, 54), 4);
});
test('fibonacciSearch3 未命中', () => {
  assert.equal(fibonacciSearch3(A, 5), -1);
  assert.equal(fibonacciSearch3(A, 100), -1);
  assert.equal(fibonacciSearch3(A, 60), -1);
});
test('fibonacciSearch3 边界', () => {
  assert.equal(fibonacciSearch3([], 1), -1);
  assert.equal(fibonacciSearch3([5], 5), 0);
  assert.equal(fibonacciSearch3([5], 3), -1);
});
test('fibonacciSearch3 钩子', () => {
  let c = 0;
  fibonacciSearch3(A, 78, { onCompare: () => c++ } as Fib3Hooks);
  assert.ok(c >= 1);
});
