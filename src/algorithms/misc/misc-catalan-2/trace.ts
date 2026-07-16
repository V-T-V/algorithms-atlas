import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalanSeq } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '卡特兰数 C0..C8', en: 'Catalan C0..C8' }).commit();
  const vs = catalanSeq(8, {
    onConclude: (vals) =>
      rec
        .begin({ zh: vals.join(','), en: vals.join(',') })
        .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void vs;
  return rec.build();
}
