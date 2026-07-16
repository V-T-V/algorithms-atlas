import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mcsLock } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(threads: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MCS 锁', en: 'MCS Lock' }).commit();
  const { order } = mcsLock(threads, {
    onAcquire: (t) =>
      rec
        .begin({ zh: 'T' + t + ' 获取', en: 'acquire' })
        .setAux([{ label: 'tid', value: 'T' + t, role: 'final' as BarRole }])
        .commit(),
    onHandoff: (f, to) =>
      rec
        .begin({ zh: 'T' + f + ' -> T' + to, en: 'handoff' })
        .setAux([{ label: 'handoff', value: 'T' + f + '->T' + to, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' })
    .setAux([{ label: 'order', value: order.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
