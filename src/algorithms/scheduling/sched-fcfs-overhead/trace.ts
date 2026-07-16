import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fcfsOverhead, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 2 },
    { id: 'C', arrival: 0, burst: 1 },
  ] as Job[],
  overhead: 1,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FCFS 开销=' + input.overhead, en: 'FCFS oh=' + input.overhead }).commit();
  const r = fcfsOverhead(input.jobs, input.overhead, {
    onPick: (j, t) =>
      rec
        .begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id })
        .setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }])
        .commit(),
    onSwitch: (t) =>
      rec
        .begin({ zh: t + ': 切换', en: t + ': switch' })
        .setAux([{ label: 'switch', value: '1', role: 'swap' as BarRole }])
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
