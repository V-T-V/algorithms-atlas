import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cfs, type CfsJob } from './impl.ts';
export const DEFAULT_INPUT: CfsJob[] = [
  { id: 'A', arrival: 0, burst: 3, weight: 1 },
  { id: 'B', arrival: 0, burst: 3, weight: 2 },
  { id: 'C', arrival: 0, burst: 3, weight: 3 },
];
export function buildTrace(input: CfsJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CFS', en: 'CFS' }).commit();
  const r = cfs(input, {
    onRun: (id, v, t) =>
      rec
        .begin({
          zh: t + ': ' + id + ' vr=' + v.toFixed(0),
          en: t + ': ' + id + ' vr=' + v.toFixed(0),
        })
        .setAux([{ label: 'vr', value: v.toFixed(0), role: 'pivot' as BarRole }])
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
