import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clhLock } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(threads: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CLH 锁', en: 'CLH Lock' }).commit();
  const order = clhLock(threads, {
    onSpin: (t, pred) =>
      rec
        .begin({ zh: 'T' + t + ' 自旋等 T' + pred, en: 'spin' })
        .setAux([
          { label: 'tid', value: 'T' + t, role: 'compare' as BarRole },
          { label: 'pred', value: 'T' + pred, role: 'pivot' as BarRole },
        ])
        .commit(),
    onAcquire: (t) =>
      rec
        .begin({ zh: 'T' + t + ' 获取', en: 'acquire' })
        .setAux([{ label: 'tid', value: 'T' + t, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' })
    .setAux([{ label: 'order', value: order.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
