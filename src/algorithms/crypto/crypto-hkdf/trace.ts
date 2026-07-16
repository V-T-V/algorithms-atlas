import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hkdfExpand } from './impl.ts';
export const DEFAULT_INPUT: any = { prk: [1, 2, 3, 4], info: [10], len: 16 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'HKDF len=' + input.len, en: 'HKDF' }).commit();
  const out = hkdfExpand(input.prk, input.info, input.len, {
    onBlock: (i, t) =>
      rec
        .begin({ zh: '块 ' + i, en: 'block' })
        .setAux([{ label: 'block', value: String(i), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: out.length + ' 字节', en: out.length + 'B' })
    .setAux([{ label: 'len', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
