import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rmse } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  rec
    .begin({ zh: 'RMSE', en: 'RMSE' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  rmse(data, {
    onMean: (m) =>
      rec
        .begin({ zh: `均值=${m.toFixed(2)}`, en: `mean=${m.toFixed(2)}` })
        .setAux([{ label: 'mean', value: m.toFixed(2), role: 'compare' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `RMSE=${v.toFixed(2)}`, en: `RMSE=${v.toFixed(2)}` })
        .setAux([{ label: 'RMSE', value: v.toFixed(2), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
