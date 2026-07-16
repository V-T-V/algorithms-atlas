import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iqr } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: 'IQR', en: 'IQR' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  iqr(data, {
    onQuartiles: (q1, q3) =>
      rec
        .begin({ zh: `Q1=${q1}, Q3=${q3}`, en: `Q1=${q1}, Q3=${q3}` })
        .setBars(
          data.map((x) => ({
            value: x,
            role: (x === q1 || x === q3 ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `IQR=${v}`, en: `IQR=${v}` })
        .setAux([{ label: 'IQR', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
