import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc32 } from './impl.ts';
export const DEFAULT_INPUT: any = [72, 101, 108, 108, 111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CRC-32', en: 'CRC-32' }).commit();
  const v = crc32(input, {
    onByte: (i, c) =>
      rec
        .begin({ zh: '字节' + i, en: 'byte' })
        .setAux([{ label: 'crc', value: c.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '0x' + v.toString(16), en: v.toString(16) })
    .setAux([{ label: 'crc', value: v.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
