// Euler 法 + Richardson 外推 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerRichardson, trajectory } from './impl.ts';

export const DEFAULT_INPUT = {
  // y' = y, y(0) = 1 → 解 y = e^t，t=1 时 y=e
  f: (_t: number, y: number): number => y,
  t0: 0,
  y0: 1,
  t1: 1,
  steps: 4,
};

export function buildTrace(
  input: {
    f: (t: number, y: number) => number;
    t0: number;
    y0: number;
    t1: number;
    steps?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { f, t0, y0, t1, steps = 4 } = input;

  rec
    .begin({
      zh: `Euler + Richardson：区间 [${t0}, ${t1}]，步数 ${steps}`,
      en: `Euler + Richardson: interval [${t0}, ${t1}], steps ${steps}`,
    })
    .setAux([
      { label: '起点', value: String(t0), role: 'pivot' },
      { label: '终点', value: String(t1), role: 'pivot' },
      { label: '步数', value: String(steps), role: 'frontier' },
    ])
    .commit();

  const trj = trajectory(f, t0, y0, t1, steps);
  for (const pt of trj) {
    rec
      .begin({
        zh: `t=${pt.t.toFixed(3)}，y=${pt.y.toFixed(5)}`,
        en: `t=${pt.t.toFixed(3)}, y=${pt.y.toFixed(5)}`,
      })
      .setAux([
        { label: 't', value: pt.t.toFixed(3), role: 'pivot' },
        { label: 'y', value: pt.y.toFixed(5), role: 'compare' },
      ])
      .commit();
  }

  const { coarse, fine, extrapolated } = eulerRichardson(f, t0, y0, t1, steps);
  const exact = t1 === 1 && y0 === 1 && t0 === 0 ? Math.E : NaN;
  rec
    .begin({
      zh: `外推：A(h)=${coarse.toFixed(5)}，A(h/2)=${fine.toFixed(5)}，A*=${extrapolated.toFixed(5)}`,
      en: `Extrap: A(h)=${coarse.toFixed(5)}, A(h/2)=${fine.toFixed(5)}, A*=${extrapolated.toFixed(5)}`,
    })
    .setAux([
      { label: 'A(h)', value: coarse.toFixed(5), role: 'compare' },
      { label: 'A(h/2)', value: fine.toFixed(5), role: 'compare' },
      { label: '外推值', value: extrapolated.toFixed(5), role: 'final' },
      ...(isNaN(exact)
        ? []
        : [{ label: '精确值', value: exact.toFixed(5), role: 'final' as const }]),
    ])
    .commit();

  return rec.build();
}
