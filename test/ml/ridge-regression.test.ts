import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ridgeRegression,
  demoData,
  matInverse,
  transpose,
  matMul,
} from '../../src/algorithms/ml/ridge-regression/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/ridge-regression/trace.ts';

test('ridge 在无噪声线性数据上拟合准确', () => {
  const { X, y } = demoData(); // y = 3x + 2
  const r = ridgeRegression(X, y, { lambda: 0.01 });
  assert.ok(Math.abs(r.intercept - 2) < 0.2);
  assert.ok(Math.abs(r.coefficients[0]! - 3) < 0.2);
});

test('ridge λ=0 退化为最小二乘', () => {
  const { X, y } = demoData();
  const r = ridgeRegression(X, y, { lambda: 0 });
  // 完美拟合，MSE 接近 0
  assert.ok(r.mse < 1e-6);
});

test('ridge λ 越大系数收缩越强', () => {
  const { X, y } = demoData();
  const small = ridgeRegression(X, y, { lambda: 0.01 });
  const large = ridgeRegression(X, y, { lambda: 1000 });
  const magSmall = small.coefficients.reduce((s, c) => s + c * c, 0);
  const magLarge = large.coefficients.reduce((s, c) => s + c * c, 0);
  assert.ok(magLarge < magSmall, '大 λ 应使系数模长更小');
});

test('ridge 系数不为零（L2 不稀疏）', () => {
  const { X, y } = demoData();
  const r = ridgeRegression(X, y, { lambda: 1 });
  for (const c of r.coefficients) assert.ok(Math.abs(c) > 1e-6);
});

test('ridge 边界：空数据', () => {
  const r = ridgeRegression([], [], { lambda: 1 });
  assert.deepEqual(r.weights, []);
});

test('matInverse 单位阵的逆是自身', () => {
  const I = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const inv = matInverse(I);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) assert.ok(Math.abs(inv[i]![j]! - I[i]![j]!) < 1e-9);
});

test('matInverse × 原矩阵 = 单位阵', () => {
  const M = [
    [4, 7],
    [2, 6],
  ];
  const inv = matInverse(M);
  const prod = matMul(M, inv);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const expected = i === j ? 1 : 0;
      assert.ok(Math.abs(prod[i]![j]! - expected) < 1e-9);
    }
  }
});

test('transpose 正确', () => {
  const A = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  assert.deepEqual(transpose(A), [
    [1, 4],
    [2, 5],
    [3, 6],
  ]);
});

test('ridge 钩子被调用', () => {
  let grams = 0;
  let solves = 0;
  const { X, y } = demoData();
  ridgeRegression(
    X,
    y,
    { lambda: 1 },
    {
      onGram: () => grams++,
      onSolve: () => solves++,
    },
  );
  assert.equal(grams, 1);
  assert.equal(solves, 1);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧应含 aux');
  assert.ok(last.bars, '末帧应含 bars');
});
