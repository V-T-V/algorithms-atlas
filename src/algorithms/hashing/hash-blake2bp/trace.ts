// hash-blake2bp · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashBlake2bp } from './impl.ts';
export const DEFAULT_INPUT = 'hello world parallel';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BLAKE2bp 4 路并行', en: 'BLAKE2bp 4-way parallel' }).commit();
  let r = 0n;
  hashBlake2bp(input, {
    onLane: (l, p) =>
      rec
        .begin({ zh: `路 ${l} 完成`, en: `Lane ${l} done` })
        .setAux([{ label: '部分', value: p.toString(16).slice(0, 16), role: 'compare' as BarRole }])
        .commit(),
    onResult: (h) => {
      r = h;
    },
  });
  rec
    .begin({ zh: '合并后 256-bit', en: 'Combined 256-bit' })
    .setAux([{ label: 'hex', value: r.toString(16).padStart(64, '0'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
