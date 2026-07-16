import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeMask } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number, number]> = [
  [0xff, 0x00, 0x0f],
  [0b1010, 0b0101, 0b1100],
];
export function buildTrace(input: Array<[number, number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码合并', en: 'Merge by mask' }).commit();
  for (const [a, c, m] of input) {
    const r = mergeMask(a, c, m, {
      onResult: (v) =>
        rec
          .begin({
            zh: b(a) + ' m ' + b(m) + ' ' + b(c) + ' → ' + b(v),
            en: b(a) + ' m ' + b(m) + ' ' + b(c) + ' → ' + b(v),
          })
          .setAux([{ label: 'result', value: b(v), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '合并 = ' + b(r), en: 'merge = ' + b(r) })
      .setAux([{ label: 'merge', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
