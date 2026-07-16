import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snappyEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 9, 8, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Snappy', en: 'Snappy' }).commit();
  const out = snappyEncode(input, {
    onTag: (tag, len) =>
      rec
        .begin({ zh: (tag === 1 ? '拷贝' : '字面') + ' 长' + len, en: 'tag' })
        .setAux([
          { label: 'tag', value: tag === 1 ? 'copy' : 'lit', role: 'pivot' as BarRole },
          { label: 'len', value: String(len), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '输出 ' + out.length + ' 字节', en: out.length + 'B' })
    .setAux([{ label: 'bytes', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
