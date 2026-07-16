// Adams-Moulton · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integrateAdamsMoulton } from './impl.ts';

export const DEFAULT_INPUT = {
  // y' = y, y(0) = 1
  f: (_t: number, y: number): number => y,
  t0: 0,
  y0: 1,
  t1: 1,
  steps: 10,
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
  const { f, t0, y0, t1, steps = 10 } = input;

  rec
    .begin({
      zh: `AB4-AM4 PECE：[ ${t0}, ${t1} ]，${steps} 步`,
      en: `AB4-AM4 PECE: [${t0}, ${t1}], ${steps} steps`,
    })
    .setAux([
      { label: '起点', value: String(t0), role: 'pivot' },
      { label: '终点', value: String(t1), role: 'pivot' },
      { label: '步数', value: String(steps), role: 'frontier' },
    ])
    .commit();

  const out = integrateAdamsMoulton(f, t0, y0, t1, steps, {
    onStep: (t, yPred, yCorr) => {
      rec
        .begin({
          zh: `t=${t.toFixed(3)}：预测 ${yPred.toFixed(6)}，校正 ${yCorr.toFixed(6)}`,
          en: `t=${t.toFixed(3)}: predict ${yPred.toFixed(6)}, correct ${yCorr.toFixed(6)}`,
        })
        .setAux([
          { label: 't', value: t.toFixed(3), role: 'pivot' },
          { label: '预测值', value: yPred.toFixed(6), role: 'compare' },
          { label: '校正值', value: yCorr.toFixed(6), role: 'final' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${out.length} 点`, en: `Done: ${out.length} points` })
    .setAux([
      { label: '点数', value: String(out.length), role: 'final' },
      { label: '终值', value: out[out.length - 1]!.y.toFixed(6), role: 'final' },
    ])
    .commit();

  return rec.build();
}
