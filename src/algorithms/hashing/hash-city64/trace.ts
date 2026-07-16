// hash-city64 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashCity64 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec
    .begin({ zh: `CityHash64 "${input}"`, en: `CityHash64 "${input}"` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let r = 0n;
  hashCity64(input, 0n, {
    onOctet: (i, b, h) =>
      rec
        .begin({ zh: `字节 ${i}=${b}`, en: `Byte ${i}=${b}` })
        .setAux([{ label: 'h', value: h.toString(16), role: 'compare' as BarRole }])
        .commit(),
    onResult: (h) => {
      r = h;
    },
  });
  rec
    .begin({ zh: '64-bit', en: '64-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(16, '0'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
