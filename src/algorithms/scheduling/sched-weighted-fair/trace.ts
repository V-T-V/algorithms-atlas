import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedFairQueue, type WfJob } from './impl.ts';
export const DEFAULT_INPUT: WfJob[] = [
  { id: 'A', arrival: 0, burst: 4, weight: 2 },
  { id: 'B', arrival: 0, burst: 4, weight: 1 },
  { id: 'C', arrival: 0, burst: 2, weight: 4 },
];
export function buildTrace(input: WfJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'WFQ', en: 'WFQ' }).commit();
  const order = weightedFairQueue(input, {
    onSend: (j, vt) =>
      rec
        .begin({ zh: j.id + ' vf=' + vt.toFixed(2), en: j.id + ' vf=' + vt.toFixed(2) })
        .setAux([{ label: 'vf', value: vt.toFixed(2), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序 ' + order.join(','), en: order.join(',') })
    .setBars(order.map((o, i) => ({ value: i, role: 'final' as BarRole, label: o })))
    .commit();
  return rec.build();
}
