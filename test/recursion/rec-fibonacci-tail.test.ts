import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fibonacciTail,
  fibonacciNaive,
  fibonacciIter,
} from '../../src/algorithms/recursion/rec-fibonacci-tail/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-fibonacci-tail/trace.ts';

test('rec-fibonacci-tail 基本值', () => {
  assert.equal(fibonacciTail(0), 0n);
  assert.equal(fibonacciTail(1), 1n);
  assert.equal(fibonacciTail(10), 55n);
  assert.equal(fibonacciTail(20), 6765n);
});

test('rec-fibonacci-tail 三版本一致', () => {
  for (const n of [0, 1, 5, 15, 25]) {
    assert.equal(fibonacciTail(n), fibonacciNaive(n));
    assert.equal(fibonacciTail(n), fibonacciIter(n));
  }
});

test('rec-fibonacci-tail 支持大数', () => {
  // fib(100) = 354224848179261915075
  assert.equal(fibonacciTail(100), 354224848179261915075n);
});

test('rec-fibonacci-tail trace', () => {
  assert.ok(buildTrace().length > 2);
});
