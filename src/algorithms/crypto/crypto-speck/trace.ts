import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { speckEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [0, 0, 0, 1], block: [0, 0, 0, 2, 0, 0, 0, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Speck', en: 'Speck' }).commit();
  const ct = speckEncrypt(input.key, input.block, {
    onRound: (r, l, rr) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([{ label: 'L', value: l.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 字节', en: ct.length + 'B' })
    .setAux([{ label: 'bytes', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
