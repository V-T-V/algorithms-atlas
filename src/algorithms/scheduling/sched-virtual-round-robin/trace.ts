import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { virtualRR, type IoJob } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5, ioAt: 2, ioDur: 2 },
    { id: 'B', arrival: 0, burst: 3, ioAt: 0, ioDur: 0 },
  ] as IoJob[],
  quantum: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '虚拟轮转 q=' + input.quantum, en: 'VRR q=' + input.quantum }).commit();
  const r = virtualRR(input.jobs, input.quantum, {
    onRun: (id, q, t) =>
      rec
        .begin({ zh: t + ': ' + id + ' (' + q + ')', en: t + ': ' + id + ' (' + q + ')' })
        .setAux([{ label: 'queue', value: q, role: 'pivot' as BarRole }])
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
