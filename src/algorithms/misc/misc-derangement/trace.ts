import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { derangement } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '错排 !0..!8', en: 'Derangement !0..!8' }).commit();
  const vs = derangement(8, {
    onConclude: (vals) =>
      rec
        .begin({ zh: vals.join(','), en: vals.join(',') })
        .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void vs;
  return rec.build();
}
