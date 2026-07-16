import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { llf, type LlfJob } from './impl.ts';
export const DEFAULT_INPUT: LlfJob[] = [
  { id: 'A', arrival: 0, burst: 2, deadline: 5 },
  { id: 'B', arrival: 0, burst: 3, deadline: 6 },
];
export function buildTrace(input: LlfJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LLF', en: 'LLF' }).commit();
  const { order, missed } = llf(input, {
    onTick: (id, lax) =>
      rec
        .begin({ zh: id + ' 松弛 ' + lax, en: id + ' lax ' + lax })
        .setAux([{ label: 'lax', value: String(lax), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '错过 ' + missed, en: missed + ' missed' })
    .setBars(order.map((o, i) => ({ value: i, role: 'final' as BarRole, label: o })))
    .setAux([{ label: 'missed', value: String(missed), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
