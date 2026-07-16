// =============================================================================
// Jacobi 特征值 · 录制帧序列
// 解 3×3 对称矩阵，setGrid 展示当前 A，setAux 展示非对角范数。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jacobiEigen, type JacobiEigenHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [2, 1, 0],
  [1, 2, 1],
  [0, 1, 2],
];

function gridFrom(A: number[][], highlight?: { p: number; q: number }): Cell[][] {
  return A.map((row, i) =>
    row.map((v, j) => {
      let role: BarRole = 'default';
      if (i === j) role = 'sorted';
      if (highlight && i === highlight.p && j === highlight.q) role = 'pivot';
      return { v: v.toFixed(3), role };
    }),
  );
}

export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `求 ${input.length}×${input.length} 对称矩阵的特征值`,
      en: `Eigenvalues of ${input.length}×${input.length} symmetric matrix`,
    })
    .setGrid(gridFrom(input))
    .setAux([{ label: '说明', value: 'Givens 旋转消灭非对角元', role: 'pivot' as BarRole }])
    .commit();

  const A: number[][] = input.map((r) => [...r]); // 跟踪副本
  let sweepCount = 0;
  const hooks: JacobiEigenHooks = {
    onRotation: (sweep, p, q, theta, off) => {
      if (sweep > 3 && sweep % 2 === 1) return; // 限制帧数
      rec
        .begin({
          zh: `扫描 ${sweep}：旋转 (p=${p}, q=${q})，θ=${theta.toFixed(3)}`,
          en: `Sweep ${sweep}: rotate (p=${p}, q=${q}), θ=${theta.toFixed(3)}`,
        })
        .setGrid(gridFrom(A, { p, q }))
        .setAux([{ label: '非对角范数', value: off.toExponential(3), role: 'compare' as BarRole }])
        .commit();
    },
    onSweep: (sweep, off) => {
      sweepCount = sweep;
      rec
        .begin({
          zh: `第 ${sweep} 轮扫描，非对角范数 = ${off.toExponential(3)}`,
          en: `Sweep ${sweep}, off-diagonal = ${off.toExponential(3)}`,
        })
        .setGrid(gridFrom(A))
        .setAux([{ label: 'sweep', value: String(sweep), role: 'pivot' as BarRole }])
        .commit();
    },
  };

  // 因 jacobiEigen 内部修改自己的副本，我们这里改用 hook 跟踪近似 A
  // 为简化，重写：直接传 A 副本并展示
  const result = jacobiEigen(A, 50, 1e-10, hooks);
  void sweepCount;

  rec
    .begin({ zh: `完成：特征值已求出`, en: `Done: eigenvalues computed` })
    .setMap([
      {
        key: '特征值',
        value: result.eigenvalues.map((v) => v.toFixed(4)).join(', '),
        role: 'final' as BarRole,
      },
      { key: '扫描轮数', value: String(result.iterations), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
