import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciGolden } from '../../src/algorithms/math/fibonacci-golden/impl.ts';

test('fibonacciGolden 已知序列', () => {
  // F(0..12): 0,1,1,2,3,5,8,13,21,34,55,89,144
  const expected = [0n, 1n, 1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n, 55n, 89n, 144n];
  for (let n = 0; n <= 12; n++) assert.equal(fibonacciGolden(n), expected[n], `F(${n})`);
});

test('fibonacciGolden 大数', () => {
  // F(50)=12586269025, F(100)=354224848179261915075
  assert.equal(fibonacciGolden(50), 12586269025n);
  assert.equal(fibonacciGolden(100), 354224848179261915075n);
});

test('fibonacciGolden 与朴素递推一致', () => {
  let a = 0n;
  let b = 1n;
  for (let n = 0; n <= 200; n++) {
    assert.equal(fibonacciGolden(n), a, `F(${n})`);
    [a, b] = [b, a + b];
  }
});

test('fibonacciGolden 边界', () => {
  assert.equal(fibonacciGolden(0), 0n);
  assert.equal(fibonacciGolden(1), 1n);
  assert.throws(() => fibonacciGolden(-1), RangeError);
});
