import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciCode } from '../../src/algorithms/compression/fibonacci-code/impl.ts';

test('fibonacci-code：单值编码', () => {
  // n = v + 1；FIBS = [1,2,3,5,...]；低位在前，末尾加结束符 '1'
  assert.equal(fibonacciCode([0]).bits, '11');
  assert.equal(fibonacciCode([1]).bits, '011');
});

test('fibonacci-code：多值拼接', () => {
  assert.equal(fibonacciCode([0, 1]).bits, '11011');
});

test('fibonacci-code：空输入', () => {
  assert.equal(fibonacciCode([]).bits, '');
});
