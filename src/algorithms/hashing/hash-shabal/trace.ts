// hash-shabal · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashShabal } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  rec
    .begin({ zh: `Shabal ${bytes.length} 字节`, en: `Shabal ${bytes.length} bytes` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let r = 0n;
  hashShabal(input, {
    onBlock: (i) => rec.begin({ zh: `处理字节 ${i}`, en: `Byte ${i}` }).commit(),
    onResult: (h) => {
      r = h;
    },
  });
  rec
    .begin({ zh: '256-bit', en: '256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
