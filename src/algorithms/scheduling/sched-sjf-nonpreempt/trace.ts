import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sjfNonPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 6 },
  { id: 'B', arrival: 1, burst: 2 },
  { id: 'C', arrival: 2, burst: 4 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const acc: Array<{ id: string; start: number; end: number }> = [];
  rec.begin({ zh: 'SJF 非抢占', en: 'SJF non-preemptive' }).commit();
  const r = sjfNonPreemptive(input, {
    onPick: (j, t) => {
      acc.push({ id: j.id, start: t, end: t + j.burst });
      rec
        .begin({ zh: t + ': 运行 ' + j.id, en: t + ': run ' + j.id })
        .setBars(
          acc.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id })),
        )
        .commit();
    },
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
