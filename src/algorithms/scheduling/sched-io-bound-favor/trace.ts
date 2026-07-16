import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ioBoundFavor, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 5 },
  { id: 'B', arrival: 0, burst: 1 },
  { id: 'C', arrival: 0, burst: 2 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'I/O 密集优先', en: 'IO bound favor' }).commit();
  const r = ioBoundFavor(input, {
    onPick: (j, t) =>
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
