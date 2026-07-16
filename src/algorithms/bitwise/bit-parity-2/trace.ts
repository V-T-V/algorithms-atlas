import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parityLookup } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [7, 12, 255, 256, 0x3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '查表奇偶', en: 'Parity lookup' }).commit();
  for (const x of input) {
    const r = parityLookup(x, {
      onFold: (v) =>
        rec
          .begin({ zh: 'fold → ' + b(v), en: 'fold → ' + b(v) })
          .setAux([{ label: 'fold', value: b(v), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'parity(' + x + ')=' + r, en: 'parity(' + x + ')=' + r })
      .setAux([{ label: 'parity', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
