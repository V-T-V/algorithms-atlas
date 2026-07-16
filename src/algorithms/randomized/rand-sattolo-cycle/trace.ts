import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sattoloCycle, makeRng, isSingleCycle } from './impl.ts';

export const DEFAULT_N = 8;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 42;
  const rec = new TraceRecorder();
  const a = Array.from({ length: n }, (_, i) => i);

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        a.map((v, i) => ({
          value: v,
          role: (i === a.length - 1 ? 'final' : 'default') as BarRole,
          label: `${i}→${v}`,
        })),
      )
      .setAux([
        {
          label: '数组',
          value: a.map((v, i) => `${i}→${v}`).join(' '),
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `初始 0..${n - 1}`, en: `Init 0..${n - 1}` });

  const result = sattoloCycle(n, makeRng(seed), {
    onSwap: (_i, _j, arr) => {
      for (let k = 0; k < arr.length; k++) a[k] = arr[k]!;
      snap({ zh: '交换', en: 'Swap' });
    },
  });

  rec
    .begin({
      zh: `完成：单循环？${isSingleCycle(result)}`,
      en: `Done: single cycle? ${isSingleCycle(result)}`,
    })
    .setBars(result.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `${i}→${v}` })))
    .setAux([
      { label: '是否单循环', value: isSingleCycle(result) ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
