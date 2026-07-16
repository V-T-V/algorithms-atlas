import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { waitingTimes, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 2 },
  ] as Job[],
  turnaround: new Map([
    ['A', 3],
    ['B', 5],
  ]),
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '等待时间', en: 'Waiting time' }).commit();
  const ws = waitingTimes(input.jobs, input.turnaround, {
    onCalc: (id, w) =>
      rec
        .begin({ zh: id + ' wait=' + w, en: id + ' wait=' + w })
        .setBars([{ value: w, role: 'pivot' as BarRole, label: id }])
        .commit(),
  });
  const avg = [...ws.values()].reduce((a, b) => a + b, 0) / ws.size;
  rec
    .begin({ zh: '平均等待 ' + avg.toFixed(2), en: 'avg wait ' + avg.toFixed(2) })
    .setAux([{ label: 'avg', value: avg.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
