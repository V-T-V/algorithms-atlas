import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibGolden } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Binet 斐波那契', en: 'Binet Fibonacci' }).commit();
  const vs = fibGolden(12, {
    onConclude: (vals) =>
      rec
        .begin({ zh: vals.join(','), en: vals.join(',') })
        .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void vs;
  return rec.build();
}
