import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seidel } from '../../src/algorithms/numerical/seidel/impl.ts';
import { jacobi } from '../../src/algorithms/numerical/jacobi/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

test('seidel 解 2×2 对角占优方程组', () => {
  const r = seidel(
    [
      [4, 1],
      [2, 3],
    ],
    [1, 2],
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.x[0]!, 0.1));
  assert.ok(closeTo(r.x[1]!, 0.6));
});

test('seidel 解 3×3 经典例题 x=[1,2,-1]', () => {
  // A·[1,2,-1] = [6, 22, -10]（注意 b 必须与真解一致，否则收敛到别处）
  const r = seidel(
    [
      [10, -1, 2],
      [-1, 11, -1],
      [2, -1, 10],
    ],
    [6, 22, -10],
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.x[0]!, 1));
  assert.ok(closeTo(r.x[1]!, 2));
  assert.ok(closeTo(r.x[2]!, -1));
});

test('seidel 通常比 jacobi 收敛更快', () => {
  const A = [
    [10, -1, 2],
    [-1, 11, -1],
    [2, -1, 10],
  ];
  const b = [6, 22, -10];
  const gs = seidel(A, b, { tol: 1e-10 });
  const jac = jacobi(A, b, { tol: 1e-10 });
  assert.ok(
    gs.iterations <= jac.iterations,
    `Gauss-Seidel ${gs.iterations} 应 ≤ Jacobi ${jac.iterations}`,
  );
});

test('seidel 对角阵一步精确', () => {
  const r = seidel(
    [
      [2, 0],
      [0, 2],
    ],
    [4, 6],
    { maxIter: 5 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.x[0]!, 2));
  assert.ok(closeTo(r.x[1]!, 3));
});

test('seidel 钩子被调用', () => {
  let calls = 0;
  seidel(
    [
      [10, -1],
      [-1, 10],
    ],
    [9, 11],
    { maxIter: 5 },
    { onStep: () => calls++ },
  );
  assert.ok(calls >= 1);
});
