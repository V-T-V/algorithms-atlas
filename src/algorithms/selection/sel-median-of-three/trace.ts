import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOfThree } from './impl.ts';

export const DEFAULT_INPUT = [9, 3, 7, 1, 8, 2, 6, 5, 4, 0];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lo = 0;
  const hi = input.length - 1;
  const mid = (lo + hi) >> 1;

  const snap = (note: { zh: string; en: string }, highlight: number[]): void => {
    const roles: Record<number, BarRole> = {};
    highlight.forEach((i) => {
      roles[i] = 'compare';
    });
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([
        {
          label: '候选',
          value: `[${lo}]=${input[lo]}, [${mid}]=${input[mid]}, [${hi}]=${input[hi]}`,
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap(
    {
      zh: `初始：比较 a[${lo}]=${input[lo]}, a[${mid}]=${input[mid]}, a[${hi}]=${input[hi]}`,
      en: `Compare a[${lo}],a[${mid}],a[${hi}]`,
    },
    [lo, mid, hi],
  );

  const r = medianOfThree(input, lo, hi);

  snap({ zh: `取中位数 a[${r.index}]=${r.median}`, en: `Median a[${r.index}]=${r.median}` }, [
    r.index,
  ]);

  rec
    .begin({
      zh: `完成：中位数 = ${r.median}（索引 ${r.index}）`,
      en: `Done: median = ${r.median} (idx ${r.index})`,
    })
    .setBars(rec.barsFrom(input, { [r.index]: 'final' as BarRole }))
    .setAux([{ label: '结果', value: `median=${r.median}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
