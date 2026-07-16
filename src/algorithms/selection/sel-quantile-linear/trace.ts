import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantileLinear } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '线性分位数 q=0.25', en: 'linear quantile q=0.25' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  quantileLinear(data, 0.25, {
    onResult: (v) =>
      rec
        .begin({ zh: `Q1=${v}`, en: `Q1=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
