import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciMatrix } from '../../src/algorithms/math/fibonacci-matrix/impl.ts';

test('fibonacciMatrix 前 10 项', () => {
  const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  for (let n = 0; n < fib.length; n++) {
    assert.equal(fibonacciMatrix(n), BigInt(fib[n]!), `F_${n}`);
  }
});

test('fibonacciMatrix 较大下标', () => {
  assert.equal(fibonacciMatrix(20), 6765n);
  assert.equal(fibonacciMatrix(30), 832040n);
  assert.equal(fibonacciMatrix(50), 12586269025n);
});

test('fibonacciMatrix 返回 BigInt 类型', () => {
  assert.equal(typeof fibonacciMatrix(10), 'bigint');
});

test('fibonacciMatrix 边界与错误', () => {
  assert.equal(fibonacciMatrix(0), 0n);
  assert.equal(fibonacciMatrix(1), 1n);
  assert.throws(() => fibonacciMatrix(-1), RangeError);
});

test('fibonacciMatrix 钩子被调用', () => {
  let bits = 0;
  let squares = 0;
  let mults = 0;
  let results = 0;
  fibonacciMatrix(13, {
    onBit: () => bits++,
    onSquare: () => squares++,
    onMultiply: () => mults++,
    onResult: () => results++,
  });
  // 13 = 1101₂，4 位；square 在非末步触发 → 3 次；bit1 共 3 个 → multiply 3 次
  assert.equal(bits, 4, '位数 = 指数二进制位数');
  assert.equal(squares, 3, '平方次数 = 位数 - 1');
  assert.equal(mults, 3, '累乘次数 = 二进制中 1 的个数');
  assert.equal(results, 1, 'onResult 一次');
});
