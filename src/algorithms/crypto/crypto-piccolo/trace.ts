import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { piccoloEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0, 1, 2, 3, 4, 5, 6, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Piccolo', en: 'Piccolo' }).commit();
  const ct = piccoloEncrypt([1, 2, 3, 4], input, {
    onRound: (r, st) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([{ label: 's0', value: String(st[0]), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 字节', en: ct.length + 'B' })
    .setAux([{ label: 'bytes', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
