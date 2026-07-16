import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mad } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  rec
    .begin({ zh: 'MAD', en: 'MAD' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  mad(data, {
    onMedian: (m) =>
      rec
        .begin({ zh: `中位数=${m}`, en: `median=${m}` })
        .setAux([{ label: 'median', value: String(m), role: 'compare' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `MAD=${v}`, en: `MAD=${v}` })
        .setAux([{ label: 'MAD', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
