// Gauss-Hermite · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gaussHermite, integrateGh } from './impl.ts';

export const DEFAULT_INPUT = {
  // ∫ x² e^{-x²} dx = √π / 2
  f: (x: number): number => x * x,
  n: 8,
};

export function buildTrace(
  input: {
    f: (x: number) => number;
    n?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, n = 8 } = input;

  rec
    .begin({
      zh: `Gauss-Hermite：n=${n}，权重 e^{-x²}`,
      en: `Gauss-Hermite: n=${n}, weight e^{-x²}`,
    })
    .setAux([{ label: '节点数', value: String(n), role: 'pivot' }])
    .commit();

  const { nodes, weights } = gaussHermite(n);
  for (let k = 0; k < n; k++) {
    rec
      .begin({
        zh: `节点 ${k}：x=${nodes[k]!.toFixed(6)}，w=${weights[k]!.toExponential(4)}`,
        en: `Node ${k}: x=${nodes[k]!.toFixed(6)}, w=${weights[k]!.toExponential(4)}`,
      })
      .setAux([
        { label: '节点', value: String(k), role: 'pivot' },
        { label: 'x', value: nodes[k]!.toFixed(6), role: 'compare' },
        { label: '权重', value: weights[k]!.toExponential(4), role: 'frontier' },
      ])
      .commit();
  }

  const r = integrateGh(f, n);
  rec
    .begin({ zh: `积分 ≈ ${r.toFixed(8)}`, en: `Integral ≈ ${r.toFixed(8)}` })
    .setAux([{ label: '结果', value: r.toFixed(8), role: 'final' }])
    .commit();

  return rec.build();
}
