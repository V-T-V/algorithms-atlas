import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spscRing } from './impl.ts';
export const DEFAULT_INPUT: any = {
  cap: 4,
  ops: [{ op: 'enq', v: 1 }, { op: 'enq', v: 2 }, { op: 'deq' }, { op: 'enq', v: 3 }],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SPSC 环形 cap=' + input.cap, en: 'SPSC' }).commit();
  const r = spscRing(input.cap, input.ops, {
    onEnq: (v, h, t) =>
      rec
        .begin({ zh: 'enq ' + v + ' h=' + h + ' t=' + t, en: 'enq' })
        .setAux([{ label: 'v', value: String(v), role: 'compare' as BarRole }])
        .commit(),
    onDeq: (v, h, t) =>
      rec
        .begin({ zh: 'deq ' + v + ' h=' + h + ' t=' + t, en: 'deq' })
        .setAux([{ label: 'v', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'buf [' + r.buf.join(',') + ']', en: 'buf' })
    .setAux([{ label: 'buf', value: r.buf.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
