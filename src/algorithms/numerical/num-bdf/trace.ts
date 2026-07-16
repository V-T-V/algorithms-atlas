// BDF · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integrateBdf2 } from './impl.ts';

export const DEFAULT_INPUT = {
  // 刚性方程：y' = -1000(y - cos t) - sin t, y(0)=0
  f: (t: number, y: number): number => -1000 * (y - Math.cos(t)) - Math.sin(t),
  t0: 0,
  y0: 0,
  t1: 0.1,
  steps: 50,
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
  const { f, t0, y0, t1, steps = 50 } = input;

  rec
    .begin({
      zh: `BDF2：[ ${t0}, ${t1} ]，${steps} 步（隐式）`,
      en: `BDF2: [${t0}, ${t1}], ${steps} steps (implicit)`,
    })
    .setAux([
      { label: '起点', value: String(t0), role: 'pivot' },
      { label: '终点', value: String(t1), role: 'pivot' },
      { label: '步数', value: String(steps), role: 'frontier' },
    ])
    .commit();

  let count = 0;
  const out = integrateBdf2(f, t0, y0, t1, steps, {
    onStep: (t, y, iter) => {
      count++;
      // 每隔几步显示一次，避免帧过多
      if (count % 5 !== 0 && count !== steps - 1) return;
      rec
        .begin({
          zh: `t=${t.toFixed(4)}，y=${y.toFixed(6)}（${iter} 次迭代）`,
          en: `t=${t.toFixed(4)}, y=${y.toFixed(6)} (${iter} iterations)`,
        })
        .setAux([
          { label: 't', value: t.toFixed(4), role: 'pivot' },
          { label: 'y', value: y.toFixed(6), role: 'compare' },
          { label: '迭代', value: String(iter), role: 'frontier' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([
      { label: '点数', value: String(out.length), role: 'final' },
      { label: '终值', value: out[out.length - 1]!.y.toFixed(6), role: 'final' },
    ])
    .commit();

  return rec.build();
}
