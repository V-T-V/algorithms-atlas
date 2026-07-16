import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobiEigen } from '../../src/algorithms/numerical/jacobi-eigen/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/jacobi-eigen/trace.ts';

function approxEqual(a: number[], b: number[], tol: number): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i]! - b[i]!) > tol) return false;
  return true;
}

test('jacobi-eigen 对角矩阵返回对角元', () => {
  const { eigenvalues } = jacobiEigen([
    [3, 0],
    [0, 5],
  ]);
  const sorted = [...eigenvalues].sort((a, b) => a - b);
  assert.ok(approxEqual(sorted, [3, 5], 1e-9));
});

test('jacobi-eigen 2×2 对称矩阵已知特征值', () => {
  // [[2,1],[1,2]] 特征值 = 1, 3
  const { eigenvalues } = jacobiEigen([
    [2, 1],
    [1, 2],
  ]);
  const sorted = [...eigenvalues].sort((a, b) => a - b);
  assert.ok(approxEqual(sorted, [1, 3], 1e-9));
});

test('jacobi-eigen 3×3 已知特征值', () => {
  // [[2,1,0],[1,2,1],[0,1,2]] 特征值 = 2-√2, 2, 2+√2
  const { eigenvalues } = jacobiEigen([
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ]);
  const sorted = [...eigenvalues].sort((a, b) => a - b);
  const expected = [2 - Math.SQRT2, 2, 2 + Math.SQRT2];
  assert.ok(approxEqual(sorted, expected, 1e-6));
});

test('jacobi-eigen 特征向量正交且满足 A v = λ v', () => {
  const A = [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ];
  const { eigenvalues, eigenvectors } = jacobiEigen(A);
  const n = A.length;
  for (let k = 0; k < n; k++) {
    const v = eigenvectors[k]!;
    const Av = A.map((row) => row.reduce((acc, a, j) => acc + a * v[j]!, 0));
    const lambdaV = Av.map((x) => x / eigenvalues[k]!);
    void lambdaV;
    // Av 应与 λv 一致
    assert.ok(
      approxEqual(
        Av,
        v.map((x) => x * eigenvalues[k]!),
        1e-6,
      ),
      `λ_${k} 不满足 A v = λ v`,
    );
  }
});

test('jacobi-eigen 特征向量正交（两两内积 ≈ 0）', () => {
  const A = [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ];
  const { eigenvectors } = jacobiEigen(A);
  for (let i = 0; i < eigenvectors.length; i++) {
    for (let j = i + 1; j < eigenvectors.length; j++) {
      const dot = eigenvectors[i]!.reduce((acc, x, k) => acc + x * eigenvectors[j]![k]!, 0);
      assert.ok(Math.abs(dot) < 1e-6, `v_${i}·v_${j} = ${dot}`);
    }
  }
});

test('jacobi-eigen 钩子被调用', () => {
  const sweeps: number[] = [];
  jacobiEigen(
    [
      [2, 1],
      [1, 2],
    ],
    50,
    1e-10,
    { onSweep: (s) => sweeps.push(s) },
  );
  assert.ok(sweeps.length >= 1);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
});
