import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  backSub,
  forwardSub,
  luDecomposition,
  luSolve,
} from '../../src/algorithms/numerical/lu-decomposition/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/lu-decomposition/trace.ts';

function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const n = B[0]!.length;
  const p = B.length;
  const out: number[][] = [];
  for (let i = 0; i < m; i++) {
    const row: number[] = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < p; k++) row[j]! += A[i]![k]! * B[k]![j]!;
    }
    out.push(row);
  }
  return out;
}

test('lu A = L·U（重建）', () => {
  const A = [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ];
  const { L, U } = luDecomposition(A);
  const recon = matMul(L, U);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0]!.length; j++) {
      assert.ok(Math.abs(recon[i]![j]! - A[i]![j]!) < 1e-9, `重建不匹配 [${i}][${j}]`);
    }
  }
});

test('lu L 单位下三角，U 上三角', () => {
  const { L, U } = luDecomposition([
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ]);
  for (let i = 0; i < 3; i++) {
    assert.equal(L[i]![i], 1);
    for (let j = i + 1; j < 3; j++) assert.ok(Math.abs(L[i]![j]!) < 1e-9, `L[${i}][${j}] 非零`);
    for (let j = 0; j < i; j++) assert.ok(Math.abs(U[i]![j]!) < 1e-9, `U[${i}][${j}] 非零`);
  }
});

test('lu solve 解正确', () => {
  const A = [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ];
  const b = [4, 10, 24];
  const x = luSolve(A, b);
  // 校验 A x = b
  for (let i = 0; i < b.length; i++) {
    const sum = A[i]!.reduce((acc, a, j) => acc + a * x[j]!, 0);
    assert.ok(Math.abs(sum - b[i]!) < 1e-6, `行 ${i}: ${sum} vs ${b[i]}`);
  }
});

test('lu forward/back sub 互逆', () => {
  const L = [
    [1, 0, 0],
    [2, 1, 0],
    [3, 4, 1],
  ];
  const U = [
    [2, 1, 1],
    [0, 1, 1],
    [0, 0, 2],
  ];
  const y = forwardSub(L, [4, 10, 24]);
  const x = backSub(U, y);
  // 用 L U x 应得 b
  const recon = matMul(L, U);
  const b = recon.map((row) => row.reduce((acc, a, j) => acc + a * x[j]!, 0));
  assert.ok(Math.abs(b[0]! - 4) < 1e-9);
  assert.ok(Math.abs(b[1]! - 10) < 1e-9);
  assert.ok(Math.abs(b[2]! - 24) < 1e-9);
});

test('lu 非方阵报错', () => {
  assert.throws(() =>
    luDecomposition([
      [1, 2, 3],
      [4, 5, 6],
    ]),
  );
});

test('lu 零主元报错', () => {
  // 第一列除首项外都会导致 L 计算，但若 A[0][0]=0 立刻报错
  assert.throws(() =>
    luDecomposition([
      [0, 1],
      [1, 0],
    ]),
  );
});

test('lu 钩子被调用', () => {
  const entries: string[] = [];
  luDecomposition(
    [
      [2, 1],
      [4, 3],
    ],
    { onEntry: (i, j, _v, w) => entries.push(`${w}[${i}][${j}]`) },
  );
  assert.ok(entries.length >= 1);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
});
