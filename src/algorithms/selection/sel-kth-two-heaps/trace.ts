import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runningMedianSteps } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const snap = (
    note: { zh: string; en: string },
    inserted: number[],
    median: number,
    lo: number[],
    hi: number[],
  ): void => {
    const roles: Record<number, BarRole> = {};
    inserted.forEach((_, i) => {
      roles[i] = 'default';
    });
    rec
      .begin(note)
      .setBars(rec.barsFrom(inserted, roles))
      .setAux([
        { label: 'lo(大顶)', value: lo.join(','), role: 'compare' as BarRole },
        { label: 'hi(小顶)', value: hi.join(','), role: 'pivot' as BarRole },
        { label: '中位数', value: median.toString(), role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '初始双堆', en: 'Init two heaps' }, [], 0, [], []);

  const steps = runningMedianSteps(input);
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]!;
    snap(
      { zh: `插入 ${s.value}，中位数=${s.median}`, en: `Insert ${s.value}, median=${s.median}` },
      input.slice(0, i + 1),
      s.median,
      s.lo,
      s.hi,
    );
  }

  const finalMed = steps[steps.length - 1]!.median;
  rec
    .begin({ zh: `完成：最终中位数 ${finalMed}`, en: `Done: final median ${finalMed}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '结果', value: `中位数=${finalMed}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
