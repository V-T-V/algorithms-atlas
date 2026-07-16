import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomSample, makeRng } from './impl.ts';

export const DEFAULT_N = 10;
export const DEFAULT_K = 4;

export function buildTrace(opts: { n?: number; k?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const k = opts.k ?? DEFAULT_K;
  const seed = opts.seed ?? 7;
  const rec = new TraceRecorder();
  const pool: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const v of pool) roles[v] = 'final';
    rec
      .begin(note)
      .setBars(
        rec.barsFrom(
          Array.from({ length: n }, (_, i) => i),
          roles,
        ),
      )
      .setAux([{ label: '采样池', value: pool.join(','), role: 'final' as BarRole }])
      .commit();
  };

  snap({ zh: `从 ${n} 中抽 ${k}`, en: `Sample ${k} of ${n}` });

  const result = randomSample(n, k, makeRng(seed), {
    onInsert: (idx) => {
      pool.push(idx);
      snap({ zh: `放入 ${idx}`, en: `Insert ${idx}` });
    },
    onReplace: (idx, slot) => {
      pool[slot] = idx;
      snap({ zh: `替换槽 ${slot} 为 ${idx}`, en: `Replace slot ${slot} with ${idx}` });
    },
  });

  rec
    .begin({ zh: `完成：${result.join(',')}`, en: `Done: ${result.join(',')}` })
    .setAux([{ label: '结果', value: result.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
