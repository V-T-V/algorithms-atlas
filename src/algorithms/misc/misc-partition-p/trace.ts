import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionP } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '整数划分 p(0..10)', en: 'Partition p(0..10)' }).commit();
  const dp = partitionP(10, {
    onConclude: (vals) =>
      rec
        .begin({ zh: vals.join(','), en: vals.join(',') })
        .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void dp;
  return rec.build();
}
