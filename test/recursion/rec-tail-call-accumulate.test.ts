import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  factorialTail,
  lengthTail,
} from '../../src/algorithms/recursion/rec-tail-call-accumulate/impl.ts';

test('factorialTail 基本', () => {
  assert.equal(factorialTail(0), 1);
  assert.equal(factorialTail(1), 1);
  assert.equal(factorialTail(5), 120);
  assert.equal(factorialTail(6), 720);
});

test('factorialTail 较大', () => {
  assert.equal(factorialTail(10), 3628800);
});

test('factorialTail 负数抛错', () => {
  assert.throws(() => factorialTail(-1));
});

test('factorialTail 钩子', () => {
  let n = 0;
  factorialTail(5, { onRecurse: () => n++ });
  assert.equal(n, 4);
});

test('lengthTail', () => {
  assert.equal(lengthTail([]), 0);
  assert.equal(lengthTail([1, 2, 3]), 3);
  assert.equal(lengthTail(['a', 'b', 'c', 'd']), 4);
});
