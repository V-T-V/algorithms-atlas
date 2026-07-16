// Gauss-Legendre · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gaussLegendre, integrateGl } from './impl.ts';

export const DEFAULT_INPUT = {
  // ∫_0^1 x² dx = 1/3
  f: (x: number): number => x * x,
  a: 0,
  b: 1,
  n: 5,
};

export function buildTrace(
  input: {
    f: (x: number) => number;
    a: number;
    b: number;
    n?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, a, b, n = 5 } = input;

  rec
    .begin({
      zh: `Gauss-Legendre：n=${n}，区间 [${a}, ${b}]`,
      en: `Gauss-Legendre: n=${n}, interval [${a}, ${b}]`,
    })
    .setAux([
      { label: '节点数', value: String(n), role: 'pivot' },
      { label: '区间', value: `[${a}, ${b}]`, role: 'frontier' },
    ])
    .commit();

  const { nodes, weights } = gaussLegendre(n);
  for (let k = 0; k < n; k++) {
    rec
      .begin({
        zh: `节点 ${k}：t=${nodes[k]!.toFixed(6)}，w=${weights[k]!.toFixed(6)}`,
        en: `Node ${k}: t=${nodes[k]!.toFixed(6)}, w=${weights[k]!.toFixed(6)}`,
      })
      .setAux([
        { label: '节点', value: String(k), role: 'pivot' },
        { label: 't', value: nodes[k]!.toFixed(6), role: 'compare' },
        { label: '权重', value: weights[k]!.toFixed(6), role: 'frontier' },
      ])
      .commit();
  }

  const r = integrateGl(f, a, b, n);
  rec
    .begin({ zh: `积分 ≈ ${r.toFixed(10)}`, en: `Integral ≈ ${r.toFixed(10)}` })
    .setAux([{ label: '结果', value: r.toFixed(10), role: 'final' }])
    .commit();

  return rec.build();
}
