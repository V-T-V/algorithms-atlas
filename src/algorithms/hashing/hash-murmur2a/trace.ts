// hash-murmur2a · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashMurmur2a } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec
    .begin({ zh: `Murmur2A "${input}"`, en: `Murmur2A "${input}"` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let r = 0;
  hashMurmur2a(input, 0, {
    onChunk: (i, _k, h) =>
      rec
        .begin({ zh: `块 ${i}`, en: `Chunk ${i}` })
        .setAux([{ label: 'hash', value: (h >>> 0).toString(16), role: 'compare' as BarRole }])
        .commit(),
    onResult: (h) => {
      r = h;
    },
  });
  rec
    .begin({ zh: '32-bit', en: '32-bit' })
    .setAux([
      { label: 'hex', value: (r >>> 0).toString(16).padStart(8, '0'), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
