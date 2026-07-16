import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { casLoop } from './impl.ts';
export const DEFAULT_INPUT = {
  initial: 0,
  compute: ((c: number) => c + 1) as (c: number) => number,
  contenders: [1, 2, 3],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CAS 循环', en: 'CAS Loop' }).commit();
  const r = casLoop(input.initial, input.compute, input.contenders, {
    onAttempt: (i, e, n) =>
      rec
        .begin({ zh: '尝试#' + i + ' ' + e + '->' + n, en: 'attempt' })
        .setAux([
          { label: 'i', value: String(i), role: 'pivot' as BarRole },
          { label: 'exp', value: String(e), role: 'compare' as BarRole },
        ])
        .commit(),
    onSuccess: (v, a) =>
      rec
        .begin({ zh: '成功 ' + v + ' (' + a + '次)', en: 'success' })
        .setAux([{ label: 'val', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + r.val, en: 'final' })
    .setAux([{ label: 'val', value: String(r.val), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
