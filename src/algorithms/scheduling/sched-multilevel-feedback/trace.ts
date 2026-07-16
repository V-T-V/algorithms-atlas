import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mlfq, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 8 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 2 },
  ] as Job[],
  quantums: [2, 4, 6],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MLFQ', en: 'MLFQ' }).commit();
  const r = mlfq(input.jobs, input.quantums, {
    onRun: (id, lvl, s, d) =>
      rec
        .begin({ zh: s + ': ' + id + ' L' + lvl, en: s + ': ' + id + ' L' + lvl })
        .setAux([{ label: 'level', value: String(lvl), role: 'pivot' as BarRole }])
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
