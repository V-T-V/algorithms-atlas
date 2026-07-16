// hash-blake2sp · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashBlake2sp } from './impl.ts';
export const DEFAULT_INPUT = 'hello simd';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BLAKE2sp 8 路', en: 'BLAKE2sp 8-way' }).commit();
  let r = 0n;
  hashBlake2sp(input, {
    onLane: (l) => rec.begin({ zh: `路 ${l}`, en: `Lane ${l}` }).commit(),
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
