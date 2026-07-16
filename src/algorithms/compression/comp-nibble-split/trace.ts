import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nibbleSplitEncode } from './impl.ts';
export const DEFAULT_INPUT = [0, 5, 100, 4096];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Nibble 拆分', en: 'Nibble-Split' }).commit();
  const out = nibbleSplitEncode(input, {
    onEmit: (n, nibs) =>
      rec
        .begin({ zh: n + ' -> [' + nibs.join(',') + ']', en: 'emit' })
        .setAux([
          { label: 'n', value: String(n), role: 'compare' as BarRole },
          { label: 'nibs', value: nibs.join(','), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: out.length + ' nibbles', en: out.length + ' nibs' })
    .setAux([{ label: 'nibs', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
