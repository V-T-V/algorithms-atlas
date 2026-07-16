// =============================================================================
// XGBoost 简化版 · 录制帧序列
// setBars 展示每轮 RMSE 下降，setAux 展示叶子数与预测对比。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xgboost, demoData, type XGBoostHooks } from './impl.ts';

export interface XGBoostInput {
  X: number[][];
  y: number[];
  rounds?: number;
  lambda?: number;
}

export const DEFAULT_INPUT: XGBoostInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y, rounds: 15, lambda: 1 };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: XGBoostInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, rounds = 15, lambda = 1 } = input;

  rec
    .begin({
      zh: `数据 ${X.length} 样本，${rounds} 轮提升，λ=${lambda}`,
      en: `${X.length} samples, ${rounds} rounds, λ=${lambda}`,
    })
    .setBars(y.map((v, i) => ({ value: v, role: 'compare' as BarRole, label: `y${i}` })))
    .setAux([{ label: '初始 RMSE', value: '—', role: 'pivot' as BarRole }])
    .commit();

  const rmseBars: number[] = [];

  const hooks: XGBoostHooks = {
    onRound: (round, rmse) => {
      rmseBars.push(rmse);
      rec
        .begin({
          zh: `第 ${round + 1} 轮：加入一棵树，RMSE = ${rmse.toFixed(4)}`,
          en: `Round ${round + 1}: add a tree, RMSE = ${rmse.toFixed(4)}`,
        })
        .setBars(
          rmseBars.map((v, i) => ({
            value: v,
            role: (i === rmseBars.length - 1 ? 'final' : 'default') as BarRole,
            label: `r${i + 1}`,
          })),
        )
        .setAux([
          { label: '当前轮', value: String(round + 1), role: 'pivot' as BarRole },
          { label: 'RMSE', value: rmse.toFixed(4), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = xgboost(X, y, { rounds, lambda, maxDepth: 3 }, hooks);

  // 终态：预测对比
  rec
    .begin({
      zh: `完成：${result.trees.length} 棵树，最终 RMSE = ${result.rmseHistory.at(-1)!.toFixed(4)}`,
      en: `Done: ${result.trees.length} trees, final RMSE = ${result.rmseHistory.at(-1)!.toFixed(4)}`,
    })
    .setBars(
      y.map((v, i) => ({
        value: v,
        role: 'compare' as BarRole,
        label: `y=${v.toFixed(1)} ŷ=${result.predictions[i]!.toFixed(1)}`,
      })),
    )
    .setAux([
      { label: '树数', value: String(result.trees.length), role: 'pivot' as BarRole },
      {
        label: '最终 RMSE',
        value: (result.rmseHistory.at(-1) ?? 0).toFixed(4),
        role: 'final' as BarRole,
      },
      { label: '叶子数', value: result.leafCounts.join(','), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
