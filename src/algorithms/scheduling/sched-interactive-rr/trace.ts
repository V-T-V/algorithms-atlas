import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interactiveRR, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 0, burst: 2 },
  ] as Job[],
  quantum: 1,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '交互式RR q=' + input.quantum, en: 'IRR q=' + input.quantum }).commit();
  const r = interactiveRR(input.jobs, input.quantum, {
    onRun: (id, s, d) =>
      rec
        .begin({ zh: s + ': ' + id + 'x' + d, en: s + ': ' + id })
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
