import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binetFormula } from '../../src/algorithms/math/binet-formula/impl.ts';

test('binetFormula 前 10 项与斐波那契一致', () => {
  const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  for (let n = 0; n < fib.length; n++) {
    assert.equal(binetFormula(n), fib[n], `F_${n}`);
  }
});

test('binetFormula 较大下标', () => {
  // F_20 = 6765, F_30 = 832040
  assert.equal(binetFormula(20), 6765);
  assert.equal(binetFormula(30), 832040);
});

test('binetFormula 边界与错误', () => {
  assert.equal(binetFormula(0), 0);
  assert.equal(binetFormula(1), 1);
  assert.throws(() => binetFormula(-1), RangeError);
});

test('binetFormula 钩子被调用', () => {
  let results = 0;
  binetFormula(10, { onResult: () => results++ });
  assert.equal(results, 1, 'onResult 恰好调用一次');
});
