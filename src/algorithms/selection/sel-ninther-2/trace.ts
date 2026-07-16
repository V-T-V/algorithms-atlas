import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ninther } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0, 11, 13, 12, 10, 14];
  rec
    .begin({ zh: 'Ninther', en: 'Ninther' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const p = ninther(data, {
    onPick: (s) =>
      rec
        .begin({ zh: `采样: ${s.join(',')}`, en: `sample: ${s.join(',')}` })
        .setBars(
          data.map((v) => ({ value: v, role: (s.includes(v) ? 'compare' : 'default') as BarRole })),
        )
        .commit(),
    onResult: (pivot) =>
      rec
        .begin({ zh: `pivot=${pivot}`, en: `pivot=${pivot}` })
        .setAux([{ label: 'pivot', value: String(pivot), role: 'final' as BarRole }])
        .commit(),
  });
  void p;
  return rec.build();
}
