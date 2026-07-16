import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rateMonotonic, type PeriodicJob } from './impl.ts';
export const DEFAULT_INPUT: PeriodicJob[] = [
  { id: 'A', period: 4, burst: 1 },
  { id: 'B', period: 6, burst: 2 },
  { id: 'C', period: 8, burst: 1 },
];
export function buildTrace(input: PeriodicJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '速率单调', en: 'Rate monotonic' }).commit();
  let util = 0;
  rateMonotonic(input, {
    onAssign: (id, pri) =>
      rec
        .begin({ zh: id + ' 优先级 ' + pri, en: id + ' pri ' + pri })
        .setBars([{ value: pri, role: 'pivot' as BarRole, label: id }])
        .commit(),
    onResult: (u) => {
      util = u;
    },
  });
  rec
    .begin({ zh: '利用率 = ' + util.toFixed(2), en: 'util = ' + util.toFixed(2) })
    .setAux([{ label: 'util', value: util.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
