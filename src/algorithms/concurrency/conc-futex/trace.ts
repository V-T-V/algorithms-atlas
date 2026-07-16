import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { futexLock } from './impl.ts';
export const DEFAULT_INPUT = {
  contenders: [1, 2, 3],
  holdPattern: [
    { tid: 1, fast: true },
    { tid: 2, fast: false },
    { tid: 3, fast: true },
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Futex', en: 'Futex' }).commit();
  const { owner, waiters } = futexLock(input.contenders, input.holdPattern, {
    onAcquireFast: (t) =>
      rec
        .begin({ zh: 'T' + t + ' 快速获取', en: 'fast' })
        .setAux([{ label: 'tid', value: 'T' + t, role: 'final' as BarRole }])
        .commit(),
    onAcquireSlow: (t) =>
      rec
        .begin({ zh: 'T' + t + ' 慢速获取', en: 'slow' })
        .setAux([{ label: 'tid', value: 'T' + t, role: 'compare' as BarRole }])
        .commit(),
    onWake: (t) =>
      rec
        .begin({ zh: '唤醒 T' + t, en: 'wake' })
        .setAux([{ label: 'wake', value: 'T' + t, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'owner=' + owner + ' waiters=[' + waiters.join(',') + ']', en: 'result' })
    .setAux([{ label: 'owner', value: String(owner), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
