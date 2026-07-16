// 速度 Verlet · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integrateVerlet } from './impl.ts';

export const DEFAULT_INPUT = {
  // 简谐振子 x'' = -x
  accel: (x: number): number => -x,
  t0: 0,
  x0: 1,
  v0: 0,
  t1: 2 * Math.PI,
  steps: 30,
};

export function buildTrace(
  input: {
    accel: (x: number) => number;
    t0: number;
    x0: number;
    v0: number;
    t1: number;
    steps?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { accel, t0, x0, v0, t1, steps = 30 } = input;

  rec
    .begin({
      zh: `速度 Verlet：[ ${t0.toFixed(3)}, ${t1.toFixed(3)} ]，${steps} 步`,
      en: `Velocity Verlet: [${t0.toFixed(3)}, ${t1.toFixed(3)}], ${steps} steps`,
    })
    .setAux([
      { label: '起点', value: t0.toFixed(3), role: 'pivot' },
      { label: '终点', value: t1.toFixed(3), role: 'pivot' },
      { label: '步数', value: String(steps), role: 'frontier' },
    ])
    .commit();

  const trj = integrateVerlet(accel, t0, x0, v0, t1, steps, {
    onStep: (t, x, v) => {
      const E = 0.5 * v * v + 0.5 * x * x;
      rec
        .begin({
          zh: `t=${t.toFixed(3)}：x=${x.toFixed(4)}，v=${v.toFixed(4)}，E=${E.toFixed(4)}`,
          en: `t=${t.toFixed(3)}: x=${x.toFixed(4)}, v=${v.toFixed(4)}, E=${E.toFixed(4)}`,
        })
        .setAux([
          { label: 't', value: t.toFixed(3), role: 'pivot' },
          { label: 'x', value: x.toFixed(4), role: 'compare' },
          { label: 'v', value: v.toFixed(4), role: 'compare' },
          { label: '能量', value: E.toFixed(4), role: 'final' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([
      { label: '点数', value: String(trj.length), role: 'final' },
      { label: '终位置', value: trj[trj.length - 1]!.x.toFixed(4), role: 'final' },
    ])
    .commit();

  return rec.build();
}
