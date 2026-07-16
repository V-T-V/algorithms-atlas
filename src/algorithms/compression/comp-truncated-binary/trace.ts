import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { truncatedBinaryEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0, 1, 2, 3, 4, 5], n: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '截断二进制 n=' + input.n, en: 'TB n=' + input.n }).commit();
  const code = truncatedBinaryEncode(input.values, input.n, {
    onEmit: (v, c) =>
      rec
        .begin({ zh: v + ' -> ' + c, en: v + '->' + c })
        .setAux([
          { label: 'v', value: String(v), role: 'compare' as BarRole },
          { label: 'code', value: c, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '码流 ' + code, en: 'stream' })
    .setAux([{ label: 'code', value: code, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
