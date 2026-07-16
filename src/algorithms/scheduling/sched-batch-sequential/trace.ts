import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchSequential, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'J1', arrival: 0, burst: 5 },
  { id: 'J2', arrival: 0, burst: 3 },
  { id: 'J3', arrival: 0, burst: 2 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '批处理顺序', en: 'Batch sequential' }).commit();
  const r = batchSequential(input, {
    onRun: (j, s) =>
      rec
        .begin({ zh: s + ': ' + j.id, en: s + ': ' + j.id })
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
