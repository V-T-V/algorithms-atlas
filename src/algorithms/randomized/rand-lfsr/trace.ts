import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Lfsr } from './impl.ts';

export const DEFAULT_N = 16;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 0xace1;
  const rec = new TraceRecorder();
  const rng = new Lfsr(seed);
  const samples: number[] = [];
  let state = seed;
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
      .setAux([
        { label: '已生成', value: samples.length.toString(), role: 'compare' as const },
        {
          label: '寄存器',
          value: '0x' + state.toString(16).padStart(4, '0'),
          role: 'final' as const,
        },
      ])
      .commit();
  };
  snap({ zh: '初始化 LFSR', en: 'Init LFSR' });
  for (let i = 0; i < n; i++) {
    samples.push(rng.next());
    state = (rng as unknown as { state: number }).state;
    snap({ zh: `第 ${i + 1}`, en: `#${i + 1}` });
  }
  rec
    .begin({ zh: '完成：m-序列', en: 'Done: m-sequence' })
    .setAux([{ label: '周期', value: '2^16 - 1 = 65535', role: 'final' as const }])
    .commit();
  return rec.build();
}
