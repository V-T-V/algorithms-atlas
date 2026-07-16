// 三次样条插值 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSpline, evalSpline } from './impl.ts';

export const DEFAULT_INPUT = {
  xs: [0, 1, 2, 3, 4],
  ys: [0, 1, 4, 9, 16],
  query: 2.5,
};

export function buildTrace(
  input: {
    xs: number[];
    ys: number[];
    query?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { xs, ys, query = 2.5 } = input;

  rec
    .begin({
      zh: `三次样条：${xs.length} 个节点`,
      en: `Cubic spline: ${xs.length} nodes`,
    })
    .setAux([
      { label: '节点数', value: String(xs.length), role: 'pivot' },
      { label: '查询', value: String(query), role: 'frontier' },
    ])
    .commit();

  const spline = buildSpline(xs, ys, {
    onSolveM: (M) => {
      rec
        .begin({
          zh: `解二阶导 M = [${M.map((v) => v.toFixed(3)).join(', ')}]`,
          en: `Solved M = [${M.map((v) => v.toFixed(3)).join(', ')}]`,
        })
        .setAux([
          { label: 'M_0', value: M[0]!.toFixed(3), role: 'compare' },
          { label: 'M_n', value: M[M.length - 1]!.toFixed(3), role: 'compare' },
        ])
        .commit();
    },
  });

  const p = evalSpline(spline, query);
  rec
    .begin({
      zh: `x=${query}：S(${query}) = ${p.toFixed(6)}`,
      en: `x=${query}: S(${query}) = ${p.toFixed(6)}`,
    })
    .setAux([{ label: '插值', value: p.toFixed(6), role: 'final' }])
    .commit();

  return rec.build();
}
