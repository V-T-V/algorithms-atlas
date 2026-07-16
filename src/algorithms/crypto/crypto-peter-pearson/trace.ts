import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pearsonHash } from './impl.ts';
export const DEFAULT_INPUT: any = [72, 101, 108, 108, 111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Pearson', en: 'Pearson' }).commit();
  const h = pearsonHash(input, {
    onByte: (i, hh) =>
      rec
        .begin({ zh: '字节' + i + ' h=' + hh, en: 'byte' })
        .setAux([{ label: 'h', value: String(hh), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '哈希 ' + h, en: 'hash ' + h })
    .setAux([{ label: 'hash', value: String(h), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
