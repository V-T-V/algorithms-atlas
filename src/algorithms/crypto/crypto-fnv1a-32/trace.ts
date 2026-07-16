import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1a32 } from './impl.ts';
export const DEFAULT_INPUT: any = [72, 101, 108, 108, 111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FNV-1a', en: 'FNV-1a' }).commit();
  const h = fnv1a32(input, {
    onByte: (i, hh) =>
      rec
        .begin({ zh: '字节' + i, en: 'byte' })
        .setAux([{ label: 'h', value: hh.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '哈希 0x' + h.toString(16), en: 'hash' })
    .setAux([{ label: 'hash', value: h.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
