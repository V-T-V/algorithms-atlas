import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { percentile } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], p: 75 };

export function buildTrace(input: { arr: number[]; p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, p } = input;
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);

  const snap = (note: { zh: string; en: string }, highlight: number[]): void => {
    const roles: Record<number, BarRole> = {};
    highlight.forEach((i) => {
      roles[i] = 'compare';
    });
    rec
      .begin(note)
      .setBars(rec.barsFrom(sorted, roles))
      .setAux([
        { label: 'p', value: p.toString(), role: 'compare' as BarRole },
        { label: 'rank', value: rank.toFixed(2), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `排序后数组，p=${p}`, en: `Sorted, p=${p}` }, []);
  snap(
    {
      zh: `rank=${rank.toFixed(2)} → 区间 [${lo},${hi}]`,
      en: `rank=${rank.toFixed(2)} → [${lo},${hi}]`,
    },
    [lo, hi],
  );

  const result = percentile(arr, p);
  rec
    .begin({ zh: `完成：P${p} = ${result}`, en: `Done: P${p} = ${result}` })
    .setBars(rec.barsFrom(sorted))
    .setAux([{ label: '结果', value: `P${p}=${result}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
