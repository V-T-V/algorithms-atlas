import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multicoreFCFS, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 3 },
    { id: 'C', arrival: 0, burst: 4 },
    { id: 'D', arrival: 0, burst: 2 },
  ] as Job[],
  cores: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多核FCFS ' + input.cores + ' 核', en: 'Multicore FCFS' }).commit();
  const loads = multicoreFCFS(input.jobs, input.cores, {
    onAssign: (j, c, s) =>
      rec
        .begin({ zh: s + ': ' + j.id + ' → 核' + c, en: s + ': ' + j.id + ' → C' + c })
        .setAux([{ label: 'core', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '负载 [' + loads.join(',') + ']', en: 'loads [' + loads.join(',') + ']' })
    .setBars(loads.map((l, i) => ({ value: l, role: 'final' as BarRole, label: 'C' + i })))
    .commit();
  return rec.build();
}
