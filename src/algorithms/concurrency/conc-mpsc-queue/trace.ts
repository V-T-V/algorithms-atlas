import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mpscQueue } from './impl.ts';
export const DEFAULT_INPUT: any = [
  { op: 'enq', tid: 1, v: 10 },
  { op: 'enq', tid: 2, v: 20 },
  { op: 'deq' },
  { op: 'deq' },
];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MPSC 队列', en: 'MPSC Queue' }).commit();
  const out = mpscQueue(ops, {
    onEnq: (t, v) =>
      rec
        .begin({ zh: 'T' + t + ' 入队 ' + v, en: 'enq' })
        .setAux([{ label: 'enq', value: String(v), role: 'compare' as BarRole }])
        .commit(),
    onDeq: (v) =>
      rec
        .begin({ zh: '出队 ' + v, en: 'deq' })
        .setAux([{ label: 'deq', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '消费 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
