// 切比雪夫插值 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildChebInterp, evalCheb } from './impl.ts';

export const DEFAULT_INPUT = {
  // 在 [-1,1] 上插值 e^x
  f: (x: number): number => Math.exp(x),
  n: 8,
  query: 0.5,
};

export function buildTrace(
  input: {
    f: (x: number) => number;
    n?: number;
    query?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, n = 8, query = 0.5 } = input;

  rec
    .begin({
      zh: `切比雪夫插值：n=${n}（${n + 1} 节点），区间 [-1, 1]`,
      en: `Chebyshev interp: n=${n} (${n + 1} nodes), interval [-1, 1]`,
    })
    .setAux([
      { label: '次数', value: String(n), role: 'pivot' },
      { label: '节点数', value: String(n + 1), role: 'frontier' },
    ])
    .commit();

  const interp = buildChebInterp(f, n);
  for (let k = 0; k <= n; k++) {
    rec
      .begin({
        zh: `节点 ${k}：x=${interp.nodes[k]!.toFixed(4)}，y=${interp.values[k]!.toFixed(6)}`,
        en: `Node ${k}: x=${interp.nodes[k]!.toFixed(4)}, y=${interp.values[k]!.toFixed(6)}`,
      })
      .setAux([
        { label: '节点', value: String(k), role: 'pivot' },
        { label: 'x', value: interp.nodes[k]!.toFixed(4), role: 'compare' },
        { label: 'y', value: interp.values[k]!.toFixed(6), role: 'compare' },
      ])
      .commit();
  }

  const p = evalCheb(interp, query);
  const trueVal = f(query);
  rec
    .begin({
      zh: `x=${query}：插值 ${p.toFixed(8)}，真值 ${trueVal.toFixed(8)}，误差 ${Math.abs(p - trueVal).toExponential(2)}`,
      en: `x=${query}: interp ${p.toFixed(8)}, true ${trueVal.toFixed(8)}, err ${Math.abs(p - trueVal).toExponential(2)}`,
    })
    .setAux([
      { label: '插值', value: p.toFixed(8), role: 'final' },
      { label: '误差', value: Math.abs(p - trueVal).toExponential(2), role: 'final' },
    ])
    .commit();

  return rec.build();
}
