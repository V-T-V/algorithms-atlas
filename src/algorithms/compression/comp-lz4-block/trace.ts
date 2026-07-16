import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz4BlockEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LZ4 块', en: 'LZ4 block' }).commit();
  const out = lz4BlockEncode(input, 4, {
    onMatch: (off, len) =>
      rec
        .begin({ zh: '匹配 偏移' + off + ' 长' + len, en: 'match' })
        .setAux([
          { label: 'off', value: String(off), role: 'pivot' as BarRole },
          { label: 'len', value: String(len), role: 'final' as BarRole },
        ])
        .commit(),
    onLiteral: (len) =>
      rec
        .begin({ zh: '字面 ' + len, en: 'lit' })
        .setAux([{ label: 'lit', value: String(len), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '输出 ' + out.length + ' 字节', en: out.length + 'B' })
    .setAux([{ label: 'bytes', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
