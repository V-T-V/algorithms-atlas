// 拒绝采样 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sampleUnitDisk, estimatePi } from './impl.ts';

export const DEFAULT_INPUT = { n: 1000 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `拒绝采样单位圆（演示 + π 估计）`,
      en: `Rejection sampling unit disk (demo + π estimate)`,
    })
    .setAux([{ label: '说明', value: 'x²+y²≤1 接受', role: 'pivot' }])
    .commit();

  // 先做几次单点拒绝演示
  let demoTries = 0;
  for (let k = 0; k < 3; k++) {
    const r = sampleUnitDisk(undefined, {
      onTry: (x, y, accept) => {
        demoTries++;
        rec
          .begin({
            zh: `(${x.toFixed(2)},${y.toFixed(2)}) ${accept ? '接受' : '拒绝'}`,
            en: `(${x.toFixed(2)},${y.toFixed(2)}) ${accept ? 'accept' : 'reject'}`,
          })
          .setBars([
            { value: Math.hypot(x, y) * 100, role: (accept ? 'final' : 'warn') as BarRole },
          ])
          .commit();
      },
    });
    void r;
  }

  const pi = estimatePi(input.n);
  rec
    .begin({
      zh: `π ≈ ${pi.toFixed(4)}（${input.n} 点）`,
      en: `π ≈ ${pi.toFixed(4)} (${input.n} pts)`,
    })
    .setBars([{ value: Math.round(pi * 100), role: 'sorted' as BarRole }])
    .setAux([{ label: 'π', value: pi.toFixed(4), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
