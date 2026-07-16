import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jobPool, Policies, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 4 },
    { id: 'B', arrival: 0, burst: 2 },
    { id: 'C', arrival: 0, burst: 3 },
  ] as Job[],
  policy: 'sjf',
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '作业池 ' + input.policy, en: 'Job pool ' + input.policy }).commit();
  const r = jobPool(input.jobs, Policies[input.policy]! ?? Policies.fcfs, {
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
