import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝尔三角', en: 'Bell triangle' }).commit();
  const b = bellNumber(6, {
    onRow: (row) =>
      rec
        .begin({ zh: row.join(','), en: row.join(',') })
        .setBars(row.map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: `B_6 = ${b}`, en: `B_6 = ${b}` })
    .setBars([{ value: b, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
