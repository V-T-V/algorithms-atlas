import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityFeedback, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 3 },
  { id: 'B', arrival: 0, burst: 3 },
  { id: 'C', arrival: 0, burst: 3 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级反馈', en: 'Priority feedback' }).commit();
  const r = priorityFeedback(input, 0, {
    onRun: (id, p, t) =>
      rec
        .begin({ zh: t + ': ' + id + ' P=' + p, en: t + ': ' + id + ' P=' + p })
        .setAux([{ label: 'pri', value: String(p), role: 'pivot' as BarRole }])
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
