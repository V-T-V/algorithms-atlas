import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityQueueLock } from './impl.ts';
export const DEFAULT_INPUT = [
  { tid: 1, prio: 1 },
  { tid: 2, prio: 5 },
  { tid: 3, prio: 3 },
];
export function buildTrace(threads = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级队列锁', en: 'Priority Queue Lock' }).commit();
  const order = priorityQueueLock(threads, {
    onAcquire: (t, p) =>
      rec
        .begin({ zh: 'T' + t + '(p' + p + ') 获取', en: 'acquire' })
        .setAux([{ label: 'tid', value: 'T' + t, role: 'final' as BarRole }])
        .commit(),
    onWait: (t, p) =>
      rec
        .begin({ zh: 'T' + t + '(p' + p + ') 等待', en: 'wait' })
        .setAux([{ label: 'wait', value: 'T' + t, role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' })
    .setAux([{ label: 'order', value: order.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
