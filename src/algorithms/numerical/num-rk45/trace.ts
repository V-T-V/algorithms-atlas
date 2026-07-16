// RK45 自适应 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integrateRk45 } from './impl.ts';

export const DEFAULT_INPUT = {
  // y' = y sin(t), y(0) = 1
  f: (t: number, y: number): number => y * Math.sin(t),
  t0: 0,
  y0: 1,
  t1: 2,
  h0: 0.1,
  tol: 1e-5,
};

export function buildTrace(
  input: {
    f: (t: number, y: number) => number;
    t0: number;
    y0: number;
    t1: number;
    h0?: number;
    tol?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, t0, y0, t1, h0 = 0.1, tol = 1e-5 } = input;

  rec
    .begin({
      zh: `RKF45 自适应：[ ${t0}, ${t1} ]，tol=${tol}`,
      en: `Adaptive RKF45: [${t0}, ${t1}], tol=${tol}`,
    })
    .setAux([
      { label: '起点', value: String(t0), role: 'pivot' },
      { label: '终点', value: String(t1), role: 'pivot' },
      { label: '容差', value: String(tol), role: 'frontier' },
    ])
    .commit();

  const steps = integrateRk45(f, t0, y0, t1, h0, tol, 10000, {
    onStep: (t, y, h, error, accepted) => {
      if (!accepted) return; // 仅展示接受步以减少帧
      rec
        .begin({
          zh: `接受步：t=${t.toFixed(4)}，y=${y.toFixed(6)}，h=${h.toExponential(2)}，err=${error.toExponential(2)}`,
          en: `Accepted: t=${t.toFixed(4)}, y=${y.toFixed(6)}, h=${h.toExponential(2)}, err=${error.toExponential(2)}`,
        })
        .setAux([
          { label: 't', value: t.toFixed(4), role: 'pivot' },
          { label: 'y', value: y.toFixed(6), role: 'compare' },
          { label: '步长', value: h.toExponential(2), role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：${steps.length - 1} 接受步`,
      en: `Done: ${steps.length - 1} accepted steps`,
    })
    .setAux([
      { label: '接受步数', value: String(steps.length - 1), role: 'final' },
      { label: '终值', value: steps[steps.length - 1]!.y.toFixed(6), role: 'final' },
    ])
    .commit();

  return rec.build();
}
