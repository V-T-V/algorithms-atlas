import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hrn, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 2 },
  { id: 'B', arrival: 0, burst: 4 },
  { id: 'C', arrival: 0, burst: 8 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'HRN', en: 'HRN' }).commit();
  const r = hrn(input, {
    onPick: (j, ratio, t) =>
      rec
        .begin({
          zh: t + ': ' + j.id + ' R=' + ratio.toFixed(2),
          en: t + ': ' + j.id + ' R=' + ratio.toFixed(2),
        })
        .setAux([{ label: 'ratio', value: ratio.toFixed(2), role: 'pivot' as BarRole }])
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
