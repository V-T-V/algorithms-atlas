import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { percentileNearest } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '就近百分位 p=50', en: 'nearest percentile p=50' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  percentileNearest(data, 50, {
    onSort: (s) =>
      rec
        .begin({ zh: `排序: ${s.join(',')}`, en: `sorted: ${s.join(',')}` })
        .setBars(s.map((v) => ({ value: v, role: 'default' as BarRole })))
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `p50=${v}`, en: `p50=${v}` })
        .setAux([{ label: 'p50', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
