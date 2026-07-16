import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxBit } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [3, 7],
  [9, 2],
  [5, 5],
  [-1, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '掩码求最大', en: 'Branchless max' }).commit();
  for (const [a, b] of input) {
    const r = maxBit(a, b, {
      onMask: (m) =>
        rec
          .begin({ zh: 'mask = ' + (m >>> 0).toString(2), en: 'mask' })
          .setAux([{ label: 'mask', value: (m >>> 0).toString(2), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'max(' + a + ',' + b + ') = ' + r, en: 'max(' + a + ',' + b + ') = ' + r })
      .setAux([{ label: 'max', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
