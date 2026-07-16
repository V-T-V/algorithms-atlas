import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { turnaroundTimes, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 2 },
  ] as Job[],
  finish: new Map([
    ['A', 3],
    ['B', 5],
  ]),
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '周转时间', en: 'Turnaround' }).commit();
  const ts = turnaroundTimes(input.jobs, input.finish, {
    onCalc: (id, tat) =>
      rec
        .begin({ zh: id + ' TAT=' + tat, en: id + ' TAT=' + tat })
        .setBars([{ value: tat, role: 'pivot' as BarRole, label: id }])
        .commit(),
  });
  const avg = [...ts.values()].reduce((a, b) => a + b, 0) / ts.size;
  rec
    .begin({ zh: '平均 TAT ' + avg.toFixed(2), en: 'avg TAT ' + avg.toFixed(2) })
    .setAux([{ label: 'avg', value: avg.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
