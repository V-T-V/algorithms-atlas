import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iqr } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const r = iqr(input);

  rec
    .begin({ zh: `初始数据 n=${input.length}`, en: `Init data n=${input.length}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '原始', value: input.join(','), role: 'compare' as BarRole }])
    .commit();

  rec
    .begin({
      zh: `IQR = ${r.iqr}（Q1=${r.q1}, Q3=${r.q3}）`,
      en: `IQR = ${r.iqr} (Q1=${r.q1}, Q3=${r.q3})`,
    })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (r.outliers.includes(v) ? 'warn' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      { label: 'IQR', value: r.iqr.toString(), role: 'final' as BarRole },
      { label: '下栅栏', value: r.lowerFence.toFixed(2), role: 'compare' as BarRole },
      { label: '上栅栏', value: r.upperFence.toFixed(2), role: 'compare' as BarRole },
      { label: '离群点', value: r.outliers.join(',') || '∅', role: 'warn' as BarRole },
    ])
    .commit();
  return rec.build();
}
