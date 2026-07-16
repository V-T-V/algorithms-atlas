import { test } from 'node:test';
import assert from 'node:assert/strict';
import { powerIter } from '../../src/algorithms/numerical/power-iter/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

test('power-iter 求对角阵的最大特征值', () => {
  const r = powerIter(
    [
      [2, 0],
      [0, 1],
    ],
    { v0: [1, 1], tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.eigenvalue, 2, 1e-6));
  // 特征向量应接近 [±1, 0]
  assert.ok(closeTo(Math.abs(r.vector[0]!), 1, 1e-6));
  assert.ok(closeTo(r.vector[1]!, 0, 1e-6));
});

test('power-iter 求 [[2,1],[1,2]] 的占优特征值 = 3', () => {
  const r = powerIter(
    [
      [2, 1],
      [1, 2],
    ],
    { v0: [1, 0.5], tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.eigenvalue, 3, 1e-6));
  // 特征向量 [1,1]/√2
  assert.ok(closeTo(Math.abs(r.vector[0]!), 1 / Math.SQRT2, 1e-5));
  assert.ok(closeTo(Math.abs(r.vector[1]!), 1 / Math.SQRT2, 1e-5));
});

test('power-iter 特征向量是单位向量', () => {
  const r = powerIter(
    [
      [5, 2],
      [2, 5],
    ],
    { v0: [1, 0], tol: 1e-10 },
  );
  const norm = Math.sqrt(r.vector.reduce((s, x) => s + x * x, 0));
  assert.ok(closeTo(norm, 1, 1e-6));
});

test('power-iter 验证 Av ≈ λv', () => {
  const A = [
    [2, 1],
    [1, 2],
  ];
  const r = powerIter(A, { v0: [1, 0.3], tol: 1e-12 });
  const v = r.vector;
  const Av = [A[0]![0]! * v[0]! + A[0]![1]! * v[1]!, A[1]![0]! * v[0]! + A[1]![1]! * v[1]!];
  assert.ok(closeTo(Av[0]!, r.eigenvalue * v[0]!, 1e-5));
  assert.ok(closeTo(Av[1]!, r.eigenvalue * v[1]!, 1e-5));
});

test('power-iter 钩子被调用', () => {
  let calls = 0;
  powerIter(
    [
      [2, 0],
      [0, 1],
    ],
    { v0: [1, 1], maxIter: 5 },
    { onStep: () => calls++ },
  );
  assert.ok(calls > 0);
});
