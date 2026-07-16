import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { streamVByteEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 300, 70000, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'StreamVByte', en: 'StreamVByte' }).commit();
  const { ctrl, data } = streamVByteEncode(input, {
    onLen: (i, len) =>
      rec
        .begin({ zh: 'v' + i + ' 长度 ' + len, en: 'len' })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' as BarRole },
          { label: 'len', value: String(len), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'ctrl ' + ctrl.length + ' data ' + data.length, en: 'sizes' })
    .setAux([
      { label: 'ctrl', value: String(ctrl.length), role: 'final' as BarRole },
      { label: 'data', value: String(data.length), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
