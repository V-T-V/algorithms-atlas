// hash-superfast · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashSuperfast } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec
    .begin({
      zh: `输入 "${input}" (${bytes.length} 字节)`,
      en: `Input "${input}" (${bytes.length} bytes)`,
    })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let result: number = 0;
  hashSuperfast(input, {
    onOctet: (i, b, h) =>
      rec
        .begin({ zh: `字节 ${i}=${b} → hash=${h}`, en: `Byte ${i}=${b} → hash=${h}` })
        .setAux([{ label: '中间', value: String(h), role: 'compare' as BarRole }])
        .commit(),
    onResult: (h) => {
      result = h;
    },
  });
  const hex = (result >>> 0).toString(16).padStart(8, '0');
  rec
    .begin({ zh: `32-bit hash`, en: `32-bit hash` })
    .setAux([{ label: 'hex', value: hex, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
