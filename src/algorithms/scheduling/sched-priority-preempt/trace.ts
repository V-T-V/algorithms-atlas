import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 4, priority: 2 },
  { id: 'B', arrival: 1, burst: 3, priority: 1 },
  { id: 'C', arrival: 2, burst: 1, priority: 3 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级抢占', en: 'Priority preemptive' }).commit();
  const r = priorityPreemptive(input, {
    onRun: (id, t) =>
      rec
        .begin({ zh: t + ': ' + id, en: t + ': ' + id })
        .setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }])
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
