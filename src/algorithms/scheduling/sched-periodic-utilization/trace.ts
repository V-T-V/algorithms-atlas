import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { periodicUtilization } from './impl.ts';
export const DEFAULT_INPUT = [
  { id: 'A', period: 4, burst: 1 },
  { id: 'B', period: 6, burst: 1 },
  { id: 'C', period: 8, burst: 1 },
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '周期利用率检查', en: 'Utilization bound' }).commit();
  const r = periodicUtilization(input, {
    onResult: (util, bound, s) =>
      rec
        .begin({
          zh: 'util=' + util.toFixed(2) + ' 上界=' + bound.toFixed(2),
          en: 'util=' + util.toFixed(2) + ' bound=' + bound.toFixed(2),
        })
        .setAux([{ label: 'schedulable', value: String(s), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可调度？' + r.schedulable, en: 'schedulable? ' + r.schedulable })
    .setAux([{ label: 'ok', value: String(r.schedulable), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
