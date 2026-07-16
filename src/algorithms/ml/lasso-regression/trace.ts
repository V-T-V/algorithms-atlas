// =============================================================================
// Lasso 回归 · 录制帧序列
// 用 setBars 展示系数（随迭代收缩/变 0），setAux 展示迭代与稀疏度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lassoRegression, demoData, type LassoHooks } from './impl.ts';

export interface LassoInput {
  X: number[][];
  y: number[];
  lambda?: number;
}

export const DEFAULT_INPUT: LassoInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y, lambda: 1 };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: LassoInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, lambda = 1 } = input;
  const d = X[0]!.length;

  const snapshot = (
    note: { zh: string; en: string },
    coefficients: number[],
    iter: number,
    nnz: number,
  ): void => {
    rec
      .begin(note)
      .setBars(
        coefficients.map((c, j) => ({
          value: c,
          role: (Math.abs(c) < 1e-9 ? 'default' : 'compare') as BarRole,
          label: `w${j}`,
        })),
      )
      .setAux([
        { label: '迭代', value: String(iter), role: 'pivot' as BarRole },
        { label: '非零系数', value: String(nnz), role: 'frontier' as BarRole },
        { label: 'λ', value: String(lambda), role: 'final' as BarRole },
      ])
      .commit();
  };

  // 初始帧
  snapshot(
    {
      zh: `初始系数全 0，${d} 个特征，λ = ${lambda}`,
      en: `Initial weights all 0, ${d} features, λ = ${lambda}`,
    },
    new Array(d).fill(0),
    0,
    0,
  );

  const hooks: LassoHooks = {
    onIteration: (iter, coefficients) => {
      const nnz = coefficients.filter((c) => Math.abs(c) > 1e-9).length;
      snapshot(
        { zh: `第 ${iter + 1} 轮坐标下降`, en: `Coordinate descent round ${iter + 1}` },
        coefficients,
        iter,
        nnz,
      );
    },
  };

  const result = lassoRegression(X, y, { lambda, maxIterations: 100 }, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：截距 ${result.intercept.toFixed(3)}，非零系数 ${result.nnz}/${d}，MSE ${result.mse.toExponential(2)}`,
      en: `Done: intercept ${result.intercept.toFixed(3)}, nnz ${result.nnz}/${d}, MSE ${result.mse.toExponential(2)}`,
    })
    .setBars(
      result.coefficients.map((c, j) => ({
        value: c,
        role: (Math.abs(c) < 1e-9 ? 'default' : 'final') as BarRole,
        label: `w${j}=${c.toFixed(2)}`,
      })),
    )
    .setAux([
      { label: '截距', value: result.intercept.toFixed(4), role: 'frontier' as BarRole },
      { label: '非零系数', value: String(result.nnz), role: 'final' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
