// hash-murmur2 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashMurmur2 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = Array.from(new TextEncoder().encode(input));
  rec
    .begin({ zh: `输入 "${input}" (${bytes.length} 字节)`, en: `Input "${input}"` })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let r = 0;
  hashMurmur2(input, 0, {
    onChunk: (i, _k, h) =>
      rec
        .begin({
          zh: `块 ${i}: hash=${(h >>> 0).toString(16)}`,
          en: `Chunk ${i}: hash=${(h >>> 0).toString(16)}`,
        })
        .setAux([{ label: '中间', value: (h >>> 0).toString(16), role: 'compare' as BarRole }])
        .commit(),
    onResult: (h) => {
      r = h;
    },
  });
  rec
    .begin({ zh: `32-bit hash`, en: '32-bit hash' })
    .setAux([
      { label: 'hex', value: (r >>> 0).toString(16).padStart(8, '0'), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
