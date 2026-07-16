import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adler32 } from './impl.ts';
export const DEFAULT_INPUT: any = [87, 111, 114, 108, 100];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Adler-32', en: 'Adler-32' }).commit();
  const v = adler32(input, {
    onByte: (i, s1, s2) =>
      rec
        .begin({ zh: '字节' + i, en: 'byte' })
        .setAux([
          { label: 's1', value: String(s1), role: 'compare' as BarRole },
          { label: 's2', value: String(s2), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '0x' + v.toString(16), en: v.toString(16) })
    .setAux([{ label: 'adler', value: v.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
