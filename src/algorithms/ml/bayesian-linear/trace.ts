// =============================================================================
// 贝叶斯线性回归 · 录制帧序列
// setBars 展示后验均值系数与预测不确定度，setAux 展示精度对角线。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bayesianLinearRegression, demoData, predict, type BayesianLinearHooks } from './impl.ts';

export interface BayesianInput {
  X: number[][];
  y: number[];
  noiseVar?: number;
  priorPrecision?: number;
}

export const DEFAULT_INPUT: BayesianInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y, noiseVar: 0.5, priorPrecision: 0.1 };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: BayesianInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, noiseVar = 0.5, priorPrecision = 0.1 } = input;

  rec
    .begin({
      zh: `数据 ${X.length} 点，σ²=${noiseVar}，先验精度 τ=${priorPrecision}`,
      en: `${X.length} points, σ²=${noiseVar}, prior τ=${priorPrecision}`,
    })
    .setBars(y.map((v, i) => ({ value: v, role: 'compare' as BarRole, label: `x=${X[i]![0]}` })))
    .commit();

  const hooks: BayesianLinearHooks = {
    onPrecision: (precision) => {
      rec
        .begin({
          zh: `构造精度矩阵 Λ（${precision.length}×${precision.length}）`,
          en: `Build precision Λ (${precision.length}×${precision.length})`,
        })
        .setGrid(
          precision.map((row) => row.map((v) => ({ v: v.toFixed(2), role: 'pivot' as BarRole }))),
        )
        .commit();
    },
    onPosterior: (mean) => {
      rec
        .begin({ zh: '后验均值 m = Λ⁻¹(1/σ²)Xᵀy', en: 'Posterior mean m = Λ⁻¹(1/σ²)Xᵀy' })
        .setBars(
          mean.map((m, i) => ({
            value: m,
            role: (i === 0 ? 'frontier' : 'compare') as BarRole,
            label: `m${i}`,
          })),
        )
        .commit();
    },
  };

  const result = bayesianLinearRegression(
    X,
    y,
    { noiseVar, priorPrecision, fitIntercept: true },
    hooks,
  );

  // 终态：预测均值 + 不确定度
  rec
    .begin({
      zh: `完成：MSE ${result.mse.toExponential(2)}，预测带不确定度`,
      en: `Done: MSE ${result.mse.toExponential(2)}, predictive uncertainty`,
    })
    .setBars(
      result.predictions.map((p, i) => ({
        value: p,
        role: 'final' as BarRole,
        label: `ŷ=${p.toFixed(1)}±${Math.sqrt(result.variances[i]!).toFixed(1)}`,
      })),
    )
    .setAux([
      {
        label: '后验均值',
        value: result.posterior.mean.map((m) => m.toFixed(3)).join(', '),
        role: 'frontier' as BarRole,
      },
      { label: 'MSE', value: result.mse.toExponential(3), role: 'final' as BarRole },
    ])
    .commit();

  // 外推预测演示不确定度增大
  const xNew = 8;
  const pred = predict(result, [xNew], noiseVar, true);
  rec
    .begin({
      zh: `外推 x=${xNew}：ŷ=${pred.mean.toFixed(2)} ± ${Math.sqrt(pred.variance).toFixed(2)}（外推不确定度更大）`,
      en: `Extrapolate x=${xNew}: ŷ=${pred.mean.toFixed(2)} ± ${Math.sqrt(pred.variance).toFixed(2)} (larger uncertainty)`,
    })
    .setAux([
      { label: 'x*', value: String(xNew), role: 'pivot' as BarRole },
      { label: '预测均值', value: pred.mean.toFixed(3), role: 'final' as BarRole },
      { label: '预测方差', value: pred.variance.toFixed(3), role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}
