// =============================================================================
// LDA · 录制帧序列
// setGraph 展示两类样本 + 判别方向；setBars 展示投影值分布。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lda, demoData, type LDAHooks } from './impl.ts';

export interface LDAInput {
  X: number[][];
  y: number[];
}

export const DEFAULT_INPUT: LDAInput = (() => {
  const d = demoData();
  return { X: d.X, y: d.y };
})();

/** 录制演示帧序列。 */
export function buildTrace(input: LDAInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y } = input;

  const norm2d = (points: number[][]): ((p: number[]) => { x: number; y: number }) => {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of points) {
      if (p[0]! < minX) minX = p[0]!;
      if (p[0]! > maxX) maxX = p[0]!;
      if (p[1]! < minY) minY = p[1]!;
      if (p[1]! > maxY) maxY = p[1]!;
    }
    const sx = maxX - minX || 1;
    const sy = maxY - minY || 1;
    const pad = 0.08;
    return (p) => ({
      x: pad + ((p[0]! - minX) / sx) * (1 - 2 * pad),
      y: 1 - (pad + ((p[1]! - minY) / sy) * (1 - 2 * pad)),
    });
  };

  const norm = norm2d(X);

  // 初始帧：样本散点
  const nodes: GraphNode[] = X.map((p, i) => ({
    id: `p${i}`,
    label: `C${y[i]}`,
    x: norm(p).x,
    y: norm(p).y,
    role: (y[i] === 0 ? 'compare' : 'swap') as BarRole,
  }));
  rec
    .begin({ zh: `两类样本 ${X.length} 个`, en: `Two-class samples: ${X.length}` })
    .setGraph(nodes, [] as GraphEdge[])
    .commit();

  const hooks: LDAHooks = {
    onMean: (m0, m1) => {
      rec
        .begin({ zh: '计算类均值 μ₀、μ₁', en: 'Compute class means μ₀, μ₁' })
        .setAux([
          {
            label: 'μ₀',
            value: m0.map((v) => v.toFixed(2)).join(', '),
            role: 'compare' as BarRole,
          },
          { label: 'μ₁', value: m1.map((v) => v.toFixed(2)).join(', '), role: 'swap' as BarRole },
        ])
        .commit();
    },
    onWeights: (w) => {
      rec
        .begin({ zh: '判别方向 w ∝ S_W⁻¹(μ₁−μ₀)', en: 'Direction w ∝ S_W⁻¹(μ₁−μ₀)' })
        .setBars(w.map((v, i) => ({ value: v, role: 'pivot' as BarRole, label: `w${i}` })))
        .commit();
    },
  };

  const result = lda(X, y, {}, hooks);

  // 终态：投影分布 + 准确率
  rec
    .begin({
      zh: `完成：准确率 ${(result.accuracy * 100).toFixed(0)}%，阈值 ${result.threshold.toFixed(2)}`,
      en: `Done: accuracy ${(result.accuracy * 100).toFixed(0)}%, threshold ${result.threshold.toFixed(2)}`,
    })
    .setBars(
      result.projections.map((p, i) => ({
        value: p,
        role: (y[i] === 0 ? 'compare' : 'swap') as BarRole,
        label: `C${y[i]}`,
      })),
    )
    .setAux([
      {
        label: '方向',
        value: result.weights.map((w) => w.toFixed(3)).join(', '),
        role: 'pivot' as BarRole,
      },
      { label: '阈值', value: result.threshold.toFixed(3), role: 'final' as BarRole },
      {
        label: '准确率',
        value: (result.accuracy * 100).toFixed(1) + '%',
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
