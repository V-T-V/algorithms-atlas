import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quartiles } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);

  rec
    .begin({ zh: `排序后数据 n=${sorted.length}`, en: `Sorted data n=${sorted.length}` })
    .setBars(rec.barsFrom(sorted))
    .setAux([{ label: '已排序', value: sorted.join(','), role: 'compare' as BarRole }])
    .commit();

  const q = quartiles(sorted);

  rec
    .begin({ zh: `Q1=${q.q1} Q2=${q.q2} Q3=${q.q3}`, en: `Q1=${q.q1} Q2=${q.q2} Q3=${q.q3}` })
    .setBars(
      sorted.map((v) => ({
        value: v,
        role: (v === q.q1 || v === q.q2 || v === q.q3 ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      { label: 'Q1', value: q.q1.toString(), role: 'final' as BarRole },
      { label: 'Q2', value: q.q2.toString(), role: 'final' as BarRole },
      { label: 'Q3', value: q.q3.toString(), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
