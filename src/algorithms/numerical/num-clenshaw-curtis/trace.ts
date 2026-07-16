// Clenshaw-Curtis 求积 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clenshawCurtis, integrateCc } from './impl.ts';

export const DEFAULT_INPUT = {
  // ∫_0^π sin(x) dx = 2
  f: (x: number): number => Math.sin(x),
  a: 0,
  b: Math.PI,
  N: 8,
};

export function buildTrace(
  input: {
    f: (x: number) => number;
    a: number;
    b: number;
    N?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, a, b, N = 8 } = input;

  rec
    .begin({
      zh: `Clenshaw-Curtis：N=${N}，区间 [${a.toFixed(3)}, ${b.toFixed(3)}]`,
      en: `Clenshaw-Curtis: N=${N}, interval [${a.toFixed(3)}, ${b.toFixed(3)}]`,
    })
    .setAux([
      { label: '节点数', value: String(N + 1), role: 'pivot' },
      { label: '区间', value: `[${a.toFixed(2)}, ${b.toFixed(2)}]`, role: 'frontier' },
    ])
    .commit();

  const { nodes, weights } = clenshawCurtis(N, a, b);
  for (let k = 0; k <= N; k++) {
    rec
      .begin({
        zh: `节点 ${k}：x=${nodes[k]!.toFixed(4)}，w=${weights[k]!.toFixed(4)}`,
        en: `Node ${k}: x=${nodes[k]!.toFixed(4)}, w=${weights[k]!.toFixed(4)}`,
      })
      .setAux([
        { label: '节点', value: String(k), role: 'pivot' },
        { label: 'x', value: nodes[k]!.toFixed(4), role: 'compare' },
        { label: '权重', value: weights[k]!.toFixed(4), role: 'frontier' },
      ])
      .commit();
  }

  const result = integrateCc(f, a, b, N);
  rec
    .begin({ zh: `积分 ≈ ${result.toFixed(8)}`, en: `Integral ≈ ${result.toFixed(8)}` })
    .setAux([{ label: '结果', value: result.toFixed(8), role: 'final' }])
    .commit();

  return rec.build();
}
