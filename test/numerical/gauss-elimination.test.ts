import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gaussElimination } from '../../src/algorithms/numerical/gauss-elimination/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/gauss-elimination/trace.ts';

/** 残差无穷范数：||b - A·x||∞ */
function residual(A: number[][], x: number[], b: number[]): number {
  let max = 0;
  for (let i = 0; i < A.length; i++) {
    let s = 0;
    for (let j = 0; j < x.length; j++) s += A[i]![j]! * x[j]!;
    max = Math.max(max, Math.abs(s - b[i]!));
  }
  return max;
}

test('gauss 解 3×3 方程组（默认示例）', () => {
  const r = gaussElimination([
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ]);
  assert.ok(r.unique);
  assert.ok(Math.abs(r.solution[0]! - 2) < 1e-9);
  assert.ok(Math.abs(r.solution[1]! - 3) < 1e-9);
  assert.ok(Math.abs(r.solution[2]! - -1) < 1e-9);
});

test('gauss 解满足原方程（残差极小）', () => {
  const aug = [
    [1, 2, 3, 6],
    [4, 5, 6, 15],
    [7, 8, 10, 24],
  ];
  const A = aug.map((row) => row.slice(0, 3));
  const b = aug.map((row) => row[3]!);
  const r = gaussElimination(aug);
  assert.ok(r.unique);
  assert.ok(residual(A, r.solution, b) < 1e-9);
});

test('gauss 对角方程（无需交换）', () => {
  const r = gaussElimination([
    [2, 0, 0, 4],
    [0, 3, 0, 9],
    [0, 0, 4, 16],
  ]);
  assert.ok(Math.abs(r.solution[0]! - 2) < 1e-9);
  assert.ok(Math.abs(r.solution[1]! - 3) < 1e-9);
  assert.ok(Math.abs(r.solution[2]! - 4) < 1e-9);
});

test('gauss 主元为 0 时需换行（仍可解）', () => {
  // 第一行首列为 0，必须换行才能消元
  const r = gaussElimination([
    [0, 2, 1, 5],
    [1, 1, 1, 6],
    [2, 1, 1, 7],
  ]);
  assert.ok(r.unique);
  const A = [
    [0, 2, 1],
    [1, 1, 1],
    [2, 1, 1],
  ];
  const b = [5, 6, 7];
  assert.ok(residual(A, r.solution, b) < 1e-9);
});

test('gauss 奇异矩阵无唯一解', () => {
  // 两行成比例 → 奇异
  const r = gaussElimination([
    [1, 2, 3],
    [2, 4, 6],
  ]);
  assert.ok(!r.unique);
  assert.equal(r.solution.length, 0);
});

test('gauss 1×1 系统', () => {
  const r = gaussElimination([[5, 10]]);
  assert.ok(r.unique);
  assert.ok(Math.abs(r.solution[0]! - 2) < 1e-12);
});

test('gauss 结果为上三角矩阵', () => {
  const r = gaussElimination([
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3],
  ]);
  // 下三角（不含对角线）应接近 0
  for (let i = 1; i < r.n; i++) {
    for (let j = 0; j < i; j++) {
      assert.ok(Math.abs(r.upper[i]![j]!) < 1e-9, `upper[${i}][${j}] 应为 0`);
    }
  }
});

test('gauss 不原地修改入参', () => {
  const input = [
    [1, 1, 3],
    [2, 1, 6],
  ];
  const snapshot = input.map((r) => [...r]);
  gaussElimination(input);
  assert.deepEqual(input, snapshot);
});

test('gauss 钩子被调用（n-1 列各选一次主元）', () => {
  const pivots: number[] = [];
  const elims: number[] = [];
  gaussElimination(
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 10],
    ],
    {
      onPivot: (col) => pivots.push(col),
      onEliminate: () => elims.push(1),
    },
  );
  assert.equal(pivots.length, 3);
  assert.ok(elims.length >= 1);
});

test('buildTrace 含网格帧、主元帧、解帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(
    frames.some((f) => f.array2d),
    '存在 array2d 帧',
  );
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
  // 末帧应含解 x_1
  const x1 = last.aux!.find((e) => e.label === 'x_1');
  assert.ok(x1);
  assert.ok(Math.abs(parseFloat(x1!.value) - 2) < 1e-9);
});
