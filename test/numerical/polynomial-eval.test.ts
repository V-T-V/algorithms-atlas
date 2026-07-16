import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialEval } from '../../src/algorithms/numerical/polynomial-eval/impl.ts';

test('polynomial-eval 基本行为', () => {
  // p = 2x³ - 6x² + 2x - 1, x=3 -> p=5, p'=6x²-12x+2 -> 54-36+2=20
  assert.deepEqual(polynomialEval([2, -6, 2, -1], 3), { value: 5, derivative: 20 });
  // 常数: p=5, p'=0
  assert.deepEqual(polynomialEval([5], 100), { value: 5, derivative: 0 });
  // 线性 3x+1, x=2 -> p=7, p'=3
  assert.deepEqual(polynomialEval([3, 1], 2), { value: 7, derivative: 3 });
});

test('polynomial-eval 导数正确', () => {
  // p = x², x=5 -> p=25, p'=2x=10
  assert.deepEqual(polynomialEval([1, 0, 0], 5), { value: 25, derivative: 10 });
  // p = x³, x=2 -> p=8, p'=3x²=12
  assert.deepEqual(polynomialEval([1, 0, 0, 0], 2), { value: 8, derivative: 12 });
});

test('polynomial-eval value 与 horner 风格一致', () => {
  const naive = (c: number[], x: number): number => {
    let s = 0;
    for (let i = 0; i < c.length; i++) s += c[i]! * x ** (c.length - 1 - i);
    return s;
  };
  for (const [c, x] of [
    [[2, -6, 2, -1], 3],
    [[1, 0, 0, 0, 1], 2],
  ] as Array<[number[], number]>) {
    assert.equal(polynomialEval(c, x).value, naive(c, x));
  }
});

test('polynomial-eval 空系数', () => {
  assert.deepEqual(polynomialEval([], 7), { value: 0, derivative: 0 });
});

test('polynomial-eval 钩子被调用', () => {
  let calls = 0;
  const r = polynomialEval([2, -6, 2, -1], 3, { onStep: () => calls++ });
  assert.deepEqual(r, { value: 5, derivative: 20 });
  assert.equal(calls, 4);
});
