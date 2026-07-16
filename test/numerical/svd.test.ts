import { test } from 'node:test';
import assert from 'node:assert/strict';
import { svd, reconstruct } from '../../src/algorithms/numerical/svd/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;

test('svd: 对角矩阵的奇异值 = 对角元绝对值', () => {
  const A = [
    [3, 0],
    [0, 4],
  ];
  const r = svd(A);
  assert.deepEqual(
    [...r.singularValues].sort((a, b) => b - a),
    [4, 3],
  );
});

test('svd: 奇异值按降序排列', () => {
  const A = [
    [2, 0, 0],
    [0, 5, 0],
    [0, 0, 1],
  ];
  const r = svd(A);
  for (let i = 1; i < r.singularValues.length; i++) {
    assert.ok(r.singularValues[i]! <= r.singularValues[i - 1]!);
  }
});

test('svd: 重构 A = U·Σ·Vᵀ（精确）', () => {
  const A = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  const r = svd(A);
  const recon = reconstruct(r);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0]!.length; j++) {
      assert.ok(
        close(recon[i]![j]!, A[i]![j]!, 1e-3),
        `[${i}][${j}]: ${recon[i]![j]!} vs ${A[i]![j]!}`,
      );
    }
  }
});

test('svd: 单位矩阵奇异值全为 1', () => {
  const r = svd([
    [1, 0],
    [0, 1],
  ]);
  for (const s of r.singularValues) assert.ok(close(s, 1));
});

test('svd: 零矩阵奇异值全为 0', () => {
  const r = svd([
    [0, 0],
    [0, 0],
  ]);
  for (const s of r.singularValues) assert.ok(close(s, 0));
});

test('svd: U 的列正交归一', () => {
  const A = [
    [1, 2],
    [3, 4],
    [1, 1],
  ];
  const r = svd(A);
  const n = r.singularValues.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let d = 0;
      for (let k = 0; k < A.length; k++) d += r.U[k]![i]! * r.U[k]![j]!;
      if (i === j) assert.ok(close(d, 1, 1e-3), `U col ${i} 范数 = ${d}`);
      else assert.ok(close(d, 0, 1e-3), `U col ${i}·col ${j} = ${d}`);
    }
  }
});

test('svd: 行数 < 列数时转置处理', () => {
  const A = [[1, 2, 3]]; // 1×3
  const r = svd(A);
  const recon = reconstruct(r);
  assert.ok(close(recon[0]![0]!, 1, 1e-3));
  assert.ok(close(recon[0]![2]!, 3, 1e-3));
  // 只有一个非零奇异值
  assert.equal(r.singularValues.filter((s) => s > 1e-6).length, 1);
});

test('svd: 矩阵秩 = 非零奇异值个数', () => {
  // 秩 1 矩阵：[[1,2],[2,4]]
  const r = svd([
    [1, 2],
    [2, 4],
  ]);
  assert.equal(r.singularValues.filter((s) => s > 1e-6).length, 1);
});

test('svd: hooks 正确回调', () => {
  let sweeps = 0;
  let done: unknown = null;
  svd(
    [
      [1, 2],
      [3, 4],
    ],
    60,
    1e-12,
    {
      onSweep: () => sweeps++,
      onDone: (r) => (done = r),
    },
  );
  assert.ok(sweeps > 0);
  assert.ok(done !== null);
});

test('svd: 空矩阵', () => {
  assert.deepEqual(svd([]), { U: [], singularValues: [], V: [] });
});
