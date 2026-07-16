import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edf, type RtJob } from './impl.ts';
export const DEFAULT_INPUT: RtJob[] = [
  { id: 'A', arrival: 0, burst: 2, deadline: 4 },
  { id: 'B', arrival: 0, burst: 3, deadline: 6 },
  { id: 'C', arrival: 0, burst: 1, deadline: 3 },
];
export function buildTrace(input: RtJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'EDF', en: 'EDF' }).commit();
  const { result: r, missed } = edf(input, {
    onTick: (id, t) =>
      rec
        .begin({ zh: t + ': ' + id, en: t + ': ' + id })
        .setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '错过 ' + missed + ' 个截止', en: missed + ' missed' })
    .setBars(
      r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id })),
    )
    .setAux([{ label: 'missed', value: String(missed), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
