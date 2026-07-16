import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trivium } from './impl.ts';
export const DEFAULT_INPUT: any = {
  key: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  iv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  nBits: 8,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Trivium', en: 'Trivium' }).commit();
  const out = trivium(input.key, input.iv, input.nBits, {
    onBit: (i, b) =>
      rec
        .begin({ zh: 'bit ' + i + ' = ' + b, en: 'bit' })
        .setAux([{ label: 'bit', value: String(b), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: out.length + ' bits', en: out.length + ' bits' })
    .setAux([{ label: 'bits', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
