import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WichmannHill } from './impl.ts';

export const DEFAULT_N = 16;
export const DEFAULT_SEED = 1234567;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? DEFAULT_SEED;
  const rec = new TraceRecorder();
  const rng = new WichmannHill(seed);
  const samples: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        samples.map((v, i) => ({
          value: Math.round(v * 100),
          role: (i === samples.length - 1 ? 'final' : 'default') as BarRole,
          label: v.toFixed(3),
        })),
      )
      .setAux([
        { label: '已生成', value: samples.length.toString(), role: 'compare' as BarRole },
        {
          label: '最后一个',
          value: samples.length ? samples[samples.length - 1]!.toFixed(4) : '—',
          role: 'final' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `初始化 Wichmann-Hill seed=${seed}`, en: `Init Wichmann-Hill seed=${seed}` });

  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `生成第 ${i + 1} 个`, en: `Generate #${i + 1}` });
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  rec
    .begin({ zh: `完成：均值 ${mean.toFixed(3)} ≈ 0.5`, en: `Done: mean ${mean.toFixed(3)} ≈ 0.5` })
    .setAux([{ label: '均值', value: mean.toFixed(4), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
