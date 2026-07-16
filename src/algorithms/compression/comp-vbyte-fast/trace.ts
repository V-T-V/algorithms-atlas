import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vbyteEncode, vbyteDecode } from './impl.ts';
export const DEFAULT_INPUT = [1, 127, 128, 300, 16384];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'VByte', en: 'VByte' }).commit();
  const out = vbyteEncode(input, {
    onEmit: (v, b) =>
      rec
        .begin({ zh: v + ' -> ' + b + 'B', en: 'emit' })
        .setAux([
          { label: 'v', value: String(v), role: 'compare' as BarRole },
          { label: 'bytes', value: String(b), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '解码 [' + vbyteDecode(out).join(',') + ']', en: 'decode' })
    .setAux([{ label: 'dec', value: vbyteDecode(out).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
