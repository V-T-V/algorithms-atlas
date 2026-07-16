import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secondSmallest } from './impl.ts';

export const DEFAULT_INPUT = [7, 3, 9, 1, 8, 2, 5, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始数组 n=${input.length}`, en: `Init n=${input.length}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '方法', value: '锦标赛法', role: 'compare' as BarRole }])
    .commit();

  const r = secondSmallest(input);

  rec
    .begin({
      zh: `完成：min=${r.min}, secondMin=${r.secondMin}, 比较数=${r.comparisons}`,
      en: `Done: min=${r.min}, 2nd=${r.secondMin}, cmps=${r.comparisons}`,
    })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === r.min ? 'final' : v === r.secondMin ? 'pivot' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      { label: '最小', value: String(r.min), role: 'final' as BarRole },
      { label: '第二小', value: String(r.secondMin), role: 'pivot' as BarRole },
      { label: '比较数', value: String(r.comparisons), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
