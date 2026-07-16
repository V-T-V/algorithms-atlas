import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qrDecomposition } from '../../src/algorithms/numerical/qr-decomposition/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/qr-decomposition/trace.ts';

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

test('qr A = Q·R（重建）', () => {
  const A = DEFAULT_INPUT;
  const { Q, R } = qrDecomposition(A);
  const recon = matMul(Q, R);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0]!.length; j++) {
      assert.ok(Math.abs(recon[i]![j]! - A[i]![j]!) < 1e-9, `重建不匹配 [${i}][${j}]`);
    }
  }
});

test('qr Q 的列正交', () => {
  const { Q } = qrDecomposition(DEFAULT_INPUT);
  const n = Q[0]!.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let dot = 0;
      for (let r = 0; r < Q.length; r++) dot += Q[r]![i]! * Q[r]![j]!;
      if (i === j) assert.ok(Math.abs(dot - 1) < 1e-9, `||q_${i}|| ≠ 1`);
      else assert.ok(Math.abs(dot) < 1e-9, `q_${i}·q_${j} ≠ 0`);
    }
  }
});

test('qr R 上三角', () => {
  const { R } = qrDecomposition(DEFAULT_INPUT);
  for (let i = 0; i < R.length; i++) {
    for (let j = 0; j < i; j++) {
      assert.ok(Math.abs(R[i]![j]!) < 1e-9, `R[${i}][${j}] 非零`);
    }
  }
});

test('qr 行数 < 列数报错', () => {
  assert.throws(() => qrDecomposition([[1, 2, 3]]));
});

test('qr 钩子被调用', () => {
  const cols: number[] = [];
  qrDecomposition(DEFAULT_INPUT, { onColumn: (k) => cols.push(k) });
  assert.deepEqual(cols, [0, 1, 2]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
});
