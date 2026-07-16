import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { golombEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0, 1, 2, 5, 10], m: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Golomb m=' + input.m, en: 'Golomb m=' + input.m }).commit();
  const code = golombEncode(input.values, input.m, {
    onEmit: (n, c) =>
      rec
        .begin({ zh: n + ' -> ' + c, en: n + '->' + c })
        .setAux([
          { label: 'n', value: String(n), role: 'compare' as BarRole },
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
