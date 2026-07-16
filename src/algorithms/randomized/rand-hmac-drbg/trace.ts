import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HmacDrbg } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 7;
  const rec = new TraceRecorder();
  const rng = new HmacDrbg(seed);
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
  snap({ zh: '初始化 HMAC DRBG', en: 'Init HMAC DRBG' });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  rec
    .begin({ zh: '完成：HMAC DRBG 输出', en: 'Done: HMAC DRBG output' })
    .setAux([{ label: '说明', value: '教学简化版', role: 'warn' as const }])
    .commit();
  return rec.build();
}
