import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bswap32 } from './impl.ts';
const h = (n: number): string => '0x' + (n >>> 0).toString(16).padStart(8, '0');
export const DEFAULT_INPUT = [0x12345678, 0x000000ff, 0xff000000, 0xdeadbeef];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '字节序反转', en: 'Byte swap' }).commit();
  for (const x of input) {
    const r = bswap32(x, {
      onResult: (v) =>
        rec
          .begin({ zh: h(x) + ' → ' + h(v), en: h(x) + ' → ' + h(v) })
          .setAux([{ label: 'bswap', value: h(v), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '结果 ' + h(r), en: 'result ' + h(r) })
      .setAux([{ label: 'result', value: h(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
