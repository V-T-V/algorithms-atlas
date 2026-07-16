// hash-lookup3 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashLookup3 } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `lookup3 "${input}"`, en: `lookup3 "${input}"` }).commit();
  let r = 0;
  hashLookup3(input, 0, {
    onChunk: (off, c) =>
      rec
        .begin({ zh: `块 @${off}: c=${(c >>> 0).toString(16)}`, en: `Chunk @${off}` })
        .setAux([{ label: 'c', value: (c >>> 0).toString(16), role: 'compare' as BarRole }])
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
