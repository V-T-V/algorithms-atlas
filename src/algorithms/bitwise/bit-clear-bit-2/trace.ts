import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clearBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [0b1111, 0],
  [0b1010, 3],
  [0b1000, 3],
  [0xff, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '清位', en: 'Clear bit' }).commit();
  for (const [x, i] of input) {
    const r = clearBit(x, i, {
      onMask: (m) =>
        rec
          .begin({ zh: '~(1<<' + i + ') = ' + b(m), en: '~(1<<' + i + ') = ' + b(m) })
          .setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
