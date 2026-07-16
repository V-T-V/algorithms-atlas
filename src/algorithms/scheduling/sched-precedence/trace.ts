import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { precedenceSchedule, type PrecTask } from './impl.ts';
export const DEFAULT_INPUT: PrecTask[] = [
  { id: 'A', arrival: 0, burst: 2, deps: [] },
  { id: 'B', arrival: 0, burst: 3, deps: ['A'] },
  { id: 'C', arrival: 0, burst: 1, deps: ['A'] },
  { id: 'D', arrival: 0, burst: 2, deps: ['B', 'C'] },
];
export function buildTrace(input: PrecTask[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先约束调度', en: 'Precedence' }).commit();
  const r = precedenceSchedule(input, {
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
