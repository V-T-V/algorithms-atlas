import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOf5 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8];
  rec
    .begin({ zh: '5 元中位数', en: 'median of 5' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const m = medianOf5(data, {
    onCompare: (a, b) =>
      rec
        .begin({ zh: `比较 ${a} 与 ${b}`, en: `compare ${a} vs ${b}` })
        .setBars(
          data.map((v) => ({
            value: v,
            role: (v === a || v === b ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit(),
  });
  rec
    .begin({ zh: `中位数=${m}`, en: `median=${m}` })
    .setBars(data.map((v) => ({ value: v, role: (v === m ? 'final' : 'default') as BarRole })))
    .commit();
  return rec.build();
}
