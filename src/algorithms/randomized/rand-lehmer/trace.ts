import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Lehmer } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  const rng = new Lehmer(seed);
  const samples: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        samples.map((v) => ({
          value: Math.round(v * 100),
          role: 'default' as BarRole,
          label: v.toFixed(3),
        })),
      )
      .setAux([{ label: '已生成', value: samples.length.toString(), role: 'compare' as BarRole }])
      .commit();
  };

  snap({ zh: `初始化 Lehmer seed=${seed}`, en: `Init Lehmer seed=${seed}` });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  rec
    .begin({ zh: `完成：均值 ${mean.toFixed(3)}`, en: `Done: mean ${mean.toFixed(3)}` })
    .setAux([{ label: '均值', value: mean.toFixed(4), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
