import { test } from 'node:test';
import assert from 'node:assert/strict';
import { horner } from '../../src/algorithms/numerical/horner/impl.ts';

test('horner 基本行为', () => {
  // 2x³ - 6x² + 2x - 1 在 x=3 -> 2*27 - 6*9 + 2*3 - 1 = 5
  assert.equal(horner([2, -6, 2, -1], 3), 5);
  // 常数多项式
  assert.equal(horner([5], 100), 5);
  // 线性: 3x + 1 在 x=2 -> 7
  assert.equal(horner([3, 1], 2), 7);
});

test('horner 与朴素求值一致', () => {
  const naive = (c: number[], x: number): number => {
    let s = 0;
    for (let i = 0; i < c.length; i++) s += c[i]! * x ** (c.length - 1 - i);
    return s;
  };
  const cases: Array<[number[], number]> = [
    [[2, -6, 2, -1, 3], 3],
    [[1, 0, 0, 0, 1], 2],
    [[1, -2, 1], 5], // (x-1)^2 at 5 = 16
    [[0, 0, 0, 7], 4], // 7x at 4 = 28
  ];
  for (const [c, x] of cases) assert.equal(horner(c, x), naive(c, x), `c=${c} x=${x}`);
});

test('horner x=0 返回常数项', () => {
  assert.equal(horner([3, 2, 1], 0), 1);
  assert.equal(horner([5], 0), 5);
});

test('horner 空系数返回 0', () => {
  assert.equal(horner([], 7), 0);
});

test('horner 钩子被调用 n 次', () => {
  let calls = 0;
  const r = horner([2, -6, 2, -1], 3, { onStep: () => calls++ });
  assert.equal(r, 5);
  assert.equal(calls, 4); // 4 个系数 -> 4 步（含初始）
});
