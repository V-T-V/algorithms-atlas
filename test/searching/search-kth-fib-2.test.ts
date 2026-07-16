import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kthFibonacci2,
  type Fib2Hooks,
} from '../../src/algorithms/searching/search-kth-fib-2/impl.ts';

test('kthFibonacci2 基本', () => {
  assert.equal(kthFibonacci2(0), 0);
  assert.equal(kthFibonacci2(1), 1);
  assert.equal(kthFibonacci2(2), 1);
  assert.equal(kthFibonacci2(10), 55);
  assert.equal(kthFibonacci2(20), 6765);
});
test('kthFibonacci2 边界', () => {
  assert.throws(() => kthFibonacci2(-1));
});
test('kthFibonacci2 钩子', () => {
  let c = 0;
  kthFibonacci2(10, { onStep: () => c++ } as Fib2Hooks);
  assert.ok(c >= 1);
});
