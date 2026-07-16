import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arrivalSortSchedule, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'C', arrival: 5, burst: 2 },
  { id: 'A', arrival: 0, burst: 4 },
  { id: 'B', arrival: 2, burst: 3 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '到达排序', en: 'Arrival sort' }).commit();
  const r = arrivalSortSchedule(input, {
    onRun: (j, t) =>
      rec
        .begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id })
        .setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) })
    .setBars(
      r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id })),
    )
    .setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
