// =============================================================================
// 岭回归 · 录制帧序列
// 用 setBars 展示训练点 vs 拟合直线预测；setAux 展示系数与 MSE。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ridgeRegression, demoData, type RidgeHooks } from './impl.ts';

export interface RidgeInput {
  X: number[][];
  y: number[];
  lambda?: number;
}

export const DEFAULT_INPUT: RidgeInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y, lambda: 1 };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: RidgeInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, lambda = 1 } = input;

  const snapshot = (
    note: { zh: string; en: string },
    aux: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    rec.begin(note).setAux(aux).commit();
  };

  // 初始帧：数据点
  snapshot(
    {
      zh: `训练数据 ${X.length} 个样本（一维特征），λ = ${lambda}`,
      en: `Training data: ${X.length} samples (1D feature), λ = ${lambda}`,
    },
    [
      {
        label: '样本',
        value: X.map((r, i) => `(${r[0]},${y[i]})`).join(' '),
        role: 'compare' as BarRole,
      },
      { label: 'λ', value: String(lambda), role: 'pivot' as BarRole },
    ],
  );

  // 数据点 bars（x 为值，便于观察）
  rec
    .begin({ zh: '可视化样本值', en: 'Visualize sample values' })
    .setBars(y.map((v, i) => ({ value: v, role: 'default' as BarRole, label: `x=${X[i]![0]}` })))
    .commit();

  let solved = false;
  const hooks: RidgeHooks = {
    onGram: (gram) => {
      rec
        .begin({
          zh: `构造 XᵀX + λI（${gram.length}×${gram.length}）`,
          en: `Build XᵀX + λI (${gram.length}×${gram.length})`,
        })
        .setGrid(gram.map((row) => row.map((v) => ({ v: v.toFixed(2), role: 'pivot' as BarRole }))))
        .commit();
    },
    onSolve: (weights) => {
      solved = true;
      rec
        .begin({ zh: '闭式求解：w = (XᵀX+λI)⁻¹Xᵀy', en: 'Closed-form solve: w = (XᵀX+λI)⁻¹Xᵀy' })
        .setBars(
          weights.map((w, i) => ({
            value: w,
            role: (i === 0 ? 'frontier' : 'compare') as BarRole,
            label: `w${i}`,
          })),
        )
        .commit();
    },
  };

  const result = ridgeRegression(X, y, { lambda, fitIntercept: true }, hooks);
  void solved;

  // 终态：预测对比
  rec
    .begin({
      zh: `完成：截距 ${result.intercept.toFixed(3)}，系数 [${result.coefficients.map((c) => c.toFixed(3)).join(', ')}]，MSE ${result.mse.toExponential(2)}`,
      en: `Done: intercept ${result.intercept.toFixed(3)}, coefs [${result.coefficients.map((c) => c.toFixed(3)).join(', ')}], MSE ${result.mse.toExponential(2)}`,
    })
    .setBars(
      y.map((v, i) => ({
        value: v,
        role: 'compare' as BarRole,
        label: `y=${v} ŷ=${result.predictions[i]!.toFixed(1)}`,
      })),
    )
    .setAux([
      { label: '截距', value: result.intercept.toFixed(4), role: 'frontier' as BarRole },
      {
        label: '系数',
        value: result.coefficients.map((c) => c.toFixed(4)).join(', '),
        role: 'compare' as BarRole,
      },
      { label: 'MSE', value: result.mse.toExponential(3), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
