// =============================================================================
// 弹性网络 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { elasticNet, demoData, type ElasticNetHooks } from './impl.ts';

export interface ElasticNetInput {
  X: number[][];
  y: number[];
  lambda?: number;
  alpha?: number;
}

export const DEFAULT_INPUT: ElasticNetInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y, lambda: 1, alpha: 0.5 };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: ElasticNetInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, lambda = 1, alpha = 0.5 } = input;
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
        { label: '非零', value: String(nnz), role: 'frontier' as BarRole },
        { label: 'λα', value: (lambda * alpha).toFixed(2), role: 'final' as BarRole },
        { label: 'λ(1−α)', value: (lambda * (1 - alpha)).toFixed(2), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    {
      zh: `初始全 0，${d} 特征，λ=${lambda} α=${alpha}`,
      en: `Init zeros, ${d} features, λ=${lambda} α=${alpha}`,
    },
    new Array(d).fill(0),
    0,
    0,
  );

  const hooks: ElasticNetHooks = {
    onIteration: (iter, coefficients) => {
      const nnz = coefficients.filter((c) => Math.abs(c) > 1e-9).length;
      snapshot({ zh: `第 ${iter + 1} 轮`, en: `Round ${iter + 1}` }, coefficients, iter, nnz);
    },
  };

  const result = elasticNet(X, y, { lambda, alpha, maxIterations: 100 }, hooks);

  rec
    .begin({
      zh: `完成：截距 ${result.intercept.toFixed(3)}，非零 ${result.nnz}/${d}，MSE ${result.mse.toExponential(2)}`,
      en: `Done: intercept ${result.intercept.toFixed(3)}, nnz ${result.nnz}/${d}, MSE ${result.mse.toExponential(2)}`,
    })
    .setBars(
      result.coefficients.map((c, j) => ({
        value: c,
        role: (Math.abs(c) < 1e-9 ? 'default' : 'final') as BarRole,
        label: `w${j}=${c.toFixed(2)}`,
      })),
    )
    .commit();

  return rec.build();
}
