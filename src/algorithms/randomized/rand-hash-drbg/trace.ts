import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HashDrbg } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 0x12345;
  const rec = new TraceRecorder();
  const rng = new HashDrbg(seed);
  const samples: number[] = [];
  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        samples.map((v) => ({
          value: Math.round(v * 100),
          role: 'default' as const,
          label: v.toFixed(3),
        })),
      )
      .setAux([{ label: '已生成', value: samples.length.toString(), role: 'compare' as const }])
      .commit();
  };
  snap({ zh: '初始化 Hash DRBG', en: 'Init Hash DRBG' });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  rec
    .begin({ zh: `完成：均值 ${mean.toFixed(3)}`, en: `Done: mean ${mean.toFixed(3)}` })
    .setAux([{ label: '说明', value: '教学简化版', role: 'warn' as const }])
    .commit();
  return rec.build();
}
