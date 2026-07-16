import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobiEigen } from '../../src/algorithms/numerical/jacobi-eigen-rotation/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;
const sameEigs = (got: number[], expected: number[], eps = 1e-4): boolean => {
  if (got.length !== expected.length) return false;
  const g = [...got].sort((a, b) => a - b);
  const e = [...expected].sort((a, b) => a - b);
  for (let i = 0; i < g.length; i++) if (!close(g[i]!, e[i]!, eps)) return false;
  return true;
};

test('jacobiEigen: 对角矩阵 → 对角元即特征值', () => {
  const r = jacobiEigen([
    [5, 0],
    [0, 3],
  ]);
  assert.ok(sameEigs(r.eigenvalues, [5, 3]));
});

test('jacobiEigen: 2×2 对称矩阵', () => {
  const r = jacobiEigen([
    [4, 1],
    [1, 3],
  ]);
  const expected = [(7 + Math.sqrt(5)) / 2, (7 - Math.sqrt(5)) / 2];
  assert.ok(sameEigs(r.eigenvalues, expected));
});

test('jacobiEigen: 3×3 对称矩阵', () => {
  const r = jacobiEigen([
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ]);
  assert.ok(sameEigs(r.eigenvalues, [2, 2 + Math.sqrt(2), 2 - Math.sqrt(2)], 1e-3));
});

test('jacobiEigen: 单位矩阵 → 全 1', () => {
  const r = jacobiEigen([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  assert.ok(sameEigs(r.eigenvalues, [1, 1, 1]));
});

test('jacobiEigen: 特征向量满足 Av = λv', () => {
  const A = [
    [4, 1],
    [1, 3],
  ];
  const r = jacobiEigen(A);
  for (let k = 0; k < 2; k++) {
    const lambda = r.eigenvalues[k]!;
    const v = r.eigenvectors[k]!; // 第 k 个特征向量
    // Av
    const av = [A[0]![0]! * v[0]! + A[0]![1]! * v[1]!, A[1]![0]! * v[0]! + A[1]![1]! * v[1]!];
    assert.ok(close(av[0]!, lambda * v[0]!, 1e-3), `Av[0]=${av[0]!}, λv[0]=${lambda * v[0]!}`);
    assert.ok(close(av[1]!, lambda * v[1]!, 1e-3));
  }
});

test('jacobiEigen: 特征向量正交', () => {
  const r = jacobiEigen([
    [4, 1],
    [1, 3],
  ]);
  const v0 = r.eigenvectors[0]!;
  const v1 = r.eigenvectors[1]!;
  const dot = v0[0]! * v1[0]! + v0[1]! * v1[1]!;
  assert.ok(close(dot, 0, 1e-6));
});

test('jacobiEigen: 空矩阵', () => {
  assert.deepEqual(jacobiEigen([]).eigenvalues, []);
});

test('jacobiEigen: hooks 正确回调', () => {
  let rotations = 0;
  let done: unknown = null;
  jacobiEigen(
    [
      [4, 1],
      [1, 3],
    ],
    50,
    1e-10,
    {
      onRotation: () => rotations++,
      onDone: (r) => (done = r),
    },
  );
  assert.ok(rotations > 0);
  assert.ok(done !== null);
});

test('jacobiEigen: 非方阵 / 非对称抛错', () => {
  assert.throws(
    () =>
      jacobiEigen([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    RangeError,
  );
  assert.throws(
    () =>
      jacobiEigen([
        [1, 2],
        [3, 4],
      ]),
    RangeError,
  ); // 非对称
});
