import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eigenvaluesQR } from '../../src/algorithms/numerical/eigenvalue-qr/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;

/** 比较两组特征值（排序后逐一比较）。 */
const sameEigs = (got: number[], expected: number[], eps = 1e-4): boolean => {
  if (got.length !== expected.length) return false;
  const g = [...got].sort((a, b) => a - b);
  const e = [...expected].sort((a, b) => a - b);
  for (let i = 0; i < g.length; i++) if (!close(g[i]!, e[i]!, eps)) return false;
  return true;
};

test('eigenvaluesQR: 对角矩阵 → 对角元即特征值', () => {
  const eigs = eigenvaluesQR([
    [5, 0],
    [0, 3],
  ]);
  assert.ok(sameEigs(eigs, [5, 3]));
});

test('eigenvaluesQR: 2×2 对称矩阵', () => {
  // [[4,1],[1,3]] 特征方程 λ²−7λ+11=0 → (7±√5)/2 ≈ 4.618, 2.382
  const eigs = eigenvaluesQR([
    [4, 1],
    [1, 3],
  ]);
  const expected = [(7 + Math.sqrt(5)) / 2, (7 - Math.sqrt(5)) / 2];
  assert.ok(sameEigs(eigs, expected));
});

test('eigenvaluesQR: 3×3 对角占优', () => {
  const eigs = eigenvaluesQR([
    [6, 0, 0],
    [0, 2, 0],
    [0, 0, 4],
  ]);
  assert.ok(sameEigs(eigs, [6, 2, 4]));
});

test('eigenvaluesQR: 3×3 对称矩阵', () => {
  // [[2,1,0],[1,2,1],[0,1,2]] 特征值 2, 2±√2
  const eigs = eigenvaluesQR([
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ]);
  assert.ok(sameEigs(eigs, [2, 2 + Math.sqrt(2), 2 - Math.sqrt(2)], 1e-3));
});

test('eigenvaluesQR: 单元素矩阵', () => {
  assert.ok(sameEigs(eigenvaluesQR([[7]]), [7]));
});

test('eigenvaluesQR: 空矩阵', () => {
  assert.deepEqual(eigenvaluesQR([]), []);
});

test('eigenvaluesQR: 特征值满足 det(A−λI)=0（2×2）', () => {
  const A = [
    [3, 2],
    [1, 4],
  ];
  const eigs = eigenvaluesQR(A);
  // 验证：每个特征值满足 (3−λ)(4−λ)−2=0
  for (const lambda of eigs) {
    const det = (3 - lambda) * (4 - lambda) - 2 * 1;
    assert.ok(close(det, 0, 1e-2), `λ=${lambda} det=${det}`);
  }
});

test('eigenvaluesQR: hooks 正确回调', () => {
  let iters = 0;
  let done: number[] | null = null;
  eigenvaluesQR(
    [
      [4, 1],
      [1, 3],
    ],
    50,
    1e-10,
    {
      onIter: () => iters++,
      onDone: (e) => (done = e),
    },
  );
  assert.ok(iters > 0);
  assert.ok(done !== null);
});

test('eigenvaluesQR: 非方阵抛错', () => {
  assert.throws(
    () =>
      eigenvaluesQR([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    RangeError,
  );
});
