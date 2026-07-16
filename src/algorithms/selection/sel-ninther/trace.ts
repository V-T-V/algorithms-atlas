import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ninther } from './impl.ts';

export const DEFAULT_INPUT = [
  9, 3, 7, 1, 8, 2, 6, 5, 4, 0, 11, 13, 15, 10, 12, 14, 16, 17, 19, 18, 20, 22, 21, 24, 23, 25,
];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const snap = (note: { zh: string; en: string }, hi: number[]): void => {
    const roles: Record<number, BarRole> = {};
    hi.forEach((i) => {
      roles[i] = 'compare';
    });
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([{ label: 'n', value: input.length.toString(), role: 'compare' as BarRole }])
      .commit();
  };

  snap({ zh: `初始数组 n=${input.length}`, en: `Init n=${input.length}` }, []);

  const r = ninther(input, 0, input.length - 1);

  snap(
    { zh: `Ninther 选中 a[${r.index}]=${r.value}`, en: `Ninther picks a[${r.index}]=${r.value}` },
    [r.index],
  );

  rec
    .begin({
      zh: `完成：pivot = ${r.value}（索引 ${r.index}）`,
      en: `Done: pivot = ${r.value} (idx ${r.index})`,
    })
    .setBars(rec.barsFrom(input, { [r.index]: 'final' as BarRole }))
    .setAux([{ label: '结果', value: `ninther=${r.value}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
