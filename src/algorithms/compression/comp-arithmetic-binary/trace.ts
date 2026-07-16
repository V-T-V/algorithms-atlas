import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithmeticBinaryEncode, arithmeticBinaryDecode } from './impl.ts';
export const DEFAULT_INPUT = { bits: [1, 0, 1, 1, 0, 1], p1: 0.5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二进制算术编码 p1=' + input.p1, en: 'BAC p1=' + input.p1 }).commit();
  const code = arithmeticBinaryEncode(input.bits, input.p1, {
    onBit: (b, lo, hi) =>
      rec
        .begin({
          zh: 'bit=' + b + ' [' + lo.toFixed(3) + ',' + hi.toFixed(3) + ')',
          en: 'bit ' + b,
        })
        .setAux([
          { label: 'bit', value: String(b), role: 'pivot' as BarRole },
          { label: 'low', value: lo.toFixed(3), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  const dec = arithmeticBinaryDecode(code, input.p1, input.bits.length);
  rec
    .begin({ zh: 'code=' + code.toFixed(4) + ' 解码[' + dec.join(',') + ']', en: 'decode' })
    .setAux([
      { label: 'code', value: code.toFixed(4), role: 'final' as BarRole },
      { label: 'dec', value: dec.join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
