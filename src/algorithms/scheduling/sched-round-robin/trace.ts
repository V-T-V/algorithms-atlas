import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobin, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 3 },
    { id: 'C', arrival: 0, burst: 1 },
  ] as Job[],
  quantum: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const acc: Array<{ id: string; start: number; end: number }> = [];
  rec.begin({ zh: 'RR quantum=' + input.quantum, en: 'RR q=' + input.quantum }).commit();
  const r = roundRobin(input.jobs, input.quantum, {
    onRun: (id, s, d) => {
      acc.push({ id, start: s, end: s + d });
      rec
        .begin({ zh: s + '-' + (s + d) + ': ' + id, en: s + '-' + (s + d) + ': ' + id })
        .setBars(
          acc.map((sg) => ({ value: sg.end - sg.start, role: 'final' as BarRole, label: sg.id })),
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
