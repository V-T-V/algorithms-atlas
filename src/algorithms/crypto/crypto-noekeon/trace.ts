import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { noekeonEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Noekeon', en: 'Noekeon' }).commit();
  const ct = noekeonEncrypt([1, 2, 3, 4], input, {
    onRound: (r, st) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([{ label: 'a', value: st[0]!.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 字节', en: ct.length + 'B' })
    .setAux([{ label: 'bytes', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
