import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantileNearest } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '就近分位数 q=0.75', en: 'nearest quantile q=0.75' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  quantileNearest(data, 0.75, {
    onResult: (v) =>
      rec
        .begin({ zh: `Q3=${v}`, en: `Q3=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
