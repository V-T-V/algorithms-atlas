import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PhiFast } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 0;
  const rec = new TraceRecorder();
  const rng = new PhiFast(seed);
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

  snap({ zh: '初始化 Phi Weyl 序列', en: 'Init Phi Weyl sequence' });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  rec
    .begin({ zh: '完成：低差异准随机序列', en: 'Done: low-discrepancy sequence' })
    .setAux([{ label: '特性', value: '低差异、快速', role: 'final' as const }])
    .commit();
  return rec.build();
}
