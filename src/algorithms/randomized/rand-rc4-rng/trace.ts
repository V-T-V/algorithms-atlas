import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Rc4Rng } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number[] } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? [42, 1, 2, 3];
  const rec = new TraceRecorder();
  const rng = new Rc4Rng(seed);
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
  snap({ zh: '初始化 RC4 (KSA 完成)', en: 'Init RC4 (KSA done)' });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  rec
    .begin({ zh: '完成：RC4 PRGA 流', en: 'Done: RC4 PRGA stream' })
    .setAux([{ label: '说明', value: '仅教学用途', role: 'warn' as const }])
    .commit();
  return rec.build();
}
