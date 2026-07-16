import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityWithAging, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5, priority: 1 },
    { id: 'B', arrival: 1, burst: 2, priority: 1 },
    { id: 'C', arrival: 2, burst: 1, priority: 5 },
  ] as Job[],
  rate: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '老化优先级', en: 'Priority aging' }).commit();
  const r = priorityWithAging(input.jobs, input.rate, {
    onPick: (j, eff, t) =>
      rec
        .begin({
          zh: t + ': ' + j.id + ' 有效P=' + eff.toFixed(2),
          en: t + ': ' + j.id + ' P=' + eff.toFixed(2),
        })
        .setAux([{ label: 'P', value: eff.toFixed(2), role: 'pivot' as BarRole }])
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
