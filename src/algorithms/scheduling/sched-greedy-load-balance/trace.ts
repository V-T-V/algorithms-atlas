import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lptLoadBalance, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 3 },
    { id: 'D', arrival: 0, burst: 2 },
  ] as Job[],
  machines: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'LPT ' + input.machines + ' 机', en: 'LPT ' + input.machines + ' machines' })
    .commit();
  const loads = lptLoadBalance(input.jobs, input.machines, {
    onAssign: (j, mi) =>
      rec
        .begin({ zh: j.id + ' → 机 ' + mi, en: j.id + ' → M' + mi })
        .setBars(loads.map((l, i) => ({ value: l, role: 'pivot' as BarRole, label: 'M' + i })))
        .commit(),
  });
  rec
    .begin({ zh: '负载 [' + loads.join(',') + ']', en: 'loads [' + loads.join(',') + ']' })
    .setBars(loads.map((l, i) => ({ value: l, role: 'final' as BarRole, label: 'M' + i })))
    .commit();
  return rec.build();
}
