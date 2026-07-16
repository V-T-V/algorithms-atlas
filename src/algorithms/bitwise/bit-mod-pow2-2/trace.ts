import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPow2 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [25, 8],
  [17, 16],
  [255, 64],
  [7, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂取模', en: 'Modulo power of two' }).commit();
  for (const [x, m] of input) {
    const r = modPow2(x, m, {
      onMask: (mask) =>
        rec
          .begin({ zh: 'mask = ' + b(mask), en: 'mask = ' + b(mask) })
          .setAux([{ label: 'mask', value: b(mask), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: x + ' & ' + (m - 1) + ' = ' + r, en: x + ' & ' + (m - 1) + ' = ' + r })
      .setAux([{ label: 'mod', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
